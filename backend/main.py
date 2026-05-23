"""
ShopWise AI Backend — FastAPI server exposing 4 independent CrewAI agents.

Each agent runs standalone — no Flow chaining. Trigger modes:
  - Agent 1+2: manual OR auto-scheduled (daily / 2 days / weekly)
  - Agent 3 P1: auto at analyst_trigger_time (e.g. 17:00)
  - Agent 4:   manual after reviewing Phase 1 results
  - Agent 3 P2: auto after pickup_deadline (e.g. 19:45)

Endpoints:
  POST /api/agent/procurement       → Agent 1 (independent)
  POST /api/agent/purchasing        → Agent 2 (independent)
  POST /api/agent/analyst/phase1    → Agent 3 Phase 1 (independent)
  POST /api/agent/analyst/phase2    → Agent 3 Phase 2 (independent)
  POST /api/agent/deflection        → Agent 4 (independent)

  GET  /api/config                  → Scheduling + supplier config
  PUT  /api/config/schedule         → Update trigger interval
  PUT  /api/config/suppliers        → Update supplier source mode
  POST /api/validate                → Owner approval simulation
  GET  /api/data/{dataset}          → Raw dummy data
  GET  /api/health                  → Health check
"""

import asyncio
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

DEMO_MODE = not os.getenv("OPENAI_API_KEY")

app = FastAPI(
    title="ShopWise AI Backend",
    description="4-agent CrewAI pipeline for restaurant food-waste reduction",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "data"


# ── Models ────────────────────────────────────────────────────

class AgentRequest(BaseModel):
    restaurant_name: str = "Harbour Bistro"
    city: str = "Helsinki"
    context: str | None = None


class AgentResponse(BaseModel):
    status: str
    agent: str
    result: dict


class ScheduleUpdate(BaseModel):
    mode: str  # "manual" | "auto"
    auto_interval_days: int = 1  # 1, 2, 7
    auto_time: str = "06:00"


class SupplierSourceUpdate(BaseModel):
    source: str  # "user_provided" | "auto_fetch"


class ValidateRequest(BaseModel):
    approved: bool
    agent: str
    data: dict | None = None


# ── Mock data for demo mode (no LLM key) ─────────────────────

MOCK_RESULTS = {
    "procurement": {
        "insight": "Rainy Saturday — trim perishables, keep comfort dishes stocked.",
        "insight_detail": (
            "Rain + wind forecast reduces expected Saturday covers from ~120 to ~98. "
            "Historical rainy-Saturday data shows 18% drop in walk-ins. Trimming fresh "
            "proteins and leafy greens by ~20% protects against spoilage while keeping "
            "dinner service fully stocked."
        ),
        "order_list": [
            {"item": "Salmon", "in_stock": "0.5 kg", "stock_level": "red", "to_order": "12 kg"},
            {"item": "Potatoes", "in_stock": "4 kg", "stock_level": "green", "to_order": "40 kg"},
            {"item": "Dairy", "in_stock": "1 L", "stock_level": "red", "to_order": "25 L"},
            {"item": "Bread", "in_stock": "2 units", "stock_level": "yellow", "to_order": "20 units"},
            {"item": "Chicken breast", "in_stock": "1.5 kg", "stock_level": "yellow", "to_order": "8 kg"},
            {"item": "Whole milk", "in_stock": "3 L", "stock_level": "green", "to_order": "25 L"},
            {"item": "Cream", "in_stock": "0.5 L", "stock_level": "red", "to_order": "10 L"},
            {"item": "Butter", "in_stock": "1 kg", "stock_level": "yellow", "to_order": "4 kg"},
            {"item": "Salad greens", "in_stock": "0.3 kg", "stock_level": "red", "to_order": "6 kg"},
            {"item": "Carrots", "in_stock": "2 kg", "stock_level": "green", "to_order": "10 kg"},
            {"item": "Pasta", "in_stock": "1 kg", "stock_level": "yellow", "to_order": "5 kg"},
            {"item": "Rice", "in_stock": "0.5 kg", "stock_level": "red", "to_order": "8 kg"},
        ],
        "total_estimated_cost_eur": 286.00,
    },
    "purchasing": {
        "summary": {
            "items_to_order": 12,
            "suppliers_checked": 3,
            "combined_total_eur": 286.00,
            "saving_eur": 31.40,
        },
        "supplier_comparison": {
            "suppliers": ["Mäkinen Tukku", "Tukku Vihannes", "Nordic Wholesale"],
            "categories": [
                {
                    "name": "DAIRY",
                    "items": [
                        {"ingredient": "Whole milk", "qty": "25 L", "prices": {"Mäkinen Tukku": 0.95, "Tukku Vihannes": 0.85, "Nordic Wholesale": 0.90}, "best": "Tukku Vihannes"},
                        {"ingredient": "Cream", "qty": "10 L", "prices": {"Mäkinen Tukku": 2.10, "Tukku Vihannes": 1.95, "Nordic Wholesale": 2.00}, "best": "Tukku Vihannes"},
                        {"ingredient": "Butter", "qty": "4 kg", "prices": {"Mäkinen Tukku": 7.50, "Tukku Vihannes": 7.20, "Nordic Wholesale": 7.80}, "best": "Tukku Vihannes"},
                    ],
                },
                {
                    "name": "FRESH PRODUCE",
                    "items": [
                        {"ingredient": "Salad greens", "qty": "6 kg", "prices": {"Mäkinen Tukku": None, "Tukku Vihannes": 2.40, "Nordic Wholesale": 2.65}, "best": "Tukku Vihannes"},
                        {"ingredient": "Potatoes", "qty": "40 kg", "prices": {"Mäkinen Tukku": 0.60, "Tukku Vihannes": 0.55, "Nordic Wholesale": 0.62}, "best": "Tukku Vihannes"},
                        {"ingredient": "Carrots", "qty": "10 kg", "prices": {"Mäkinen Tukku": 0.90, "Tukku Vihannes": 0.85, "Nordic Wholesale": None}, "best": "Tukku Vihannes"},
                    ],
                },
                {
                    "name": "DRY GOODS",
                    "items": [
                        {"ingredient": "Bread (loaves)", "qty": "20 u", "prices": {"Mäkinen Tukku": 0.40, "Tukku Vihannes": None, "Nordic Wholesale": 0.38}, "best": "Nordic Wholesale"},
                        {"ingredient": "Pasta", "qty": "5 kg", "prices": {"Mäkinen Tukku": 1.80, "Tukku Vihannes": None, "Nordic Wholesale": 1.75}, "best": "Nordic Wholesale"},
                        {"ingredient": "Rice", "qty": "8 kg", "prices": {"Mäkinen Tukku": 1.50, "Tukku Vihannes": None, "Nordic Wholesale": 1.45}, "best": "Nordic Wholesale"},
                    ],
                },
            ],
            "ai_insight": "Tukku Vihannes is €1.25/kg cheaper on dairy but you currently have Mäkinen Tukku selected for those items. Switching dairy to Vihannes would save an additional €8.75 on this order.",
        },
        "final_orders": [
            {
                "supplier": "Mäkinen Tukku",
                "total_eur": 41.60,
                "items": [
                    {"item": "Chicken breast", "qty": "8 kg", "unit_price": "€5.20/kg"},
                ],
            },
            {
                "supplier": "Tukku Vihannes",
                "total_eur": 114.45,
                "items": [
                    {"item": "Whole milk", "qty": "25 L", "unit_price": "€0.85/L"},
                    {"item": "Cream", "qty": "10 L", "unit_price": "€1.95/L"},
                    {"item": "Butter", "qty": "4 kg", "unit_price": "€7.20/kg"},
                    {"item": "Salad greens", "qty": "6 kg", "unit_price": "€2.40/kg"},
                    {"item": "Potatoes", "qty": "40 kg", "unit_price": "€0.55/kg"},
                    {"item": "Carrots", "qty": "10 kg", "unit_price": "€0.85/kg"},
                ],
            },
            {
                "supplier": "Nordic Wholesale",
                "total_eur": 129.95,
                "items": [
                    {"item": "Salmon fillet", "qty": "12 kg", "unit_price": "€8.50/kg"},
                    {"item": "Bread (loaves)", "qty": "20 u", "unit_price": "€0.38/u"},
                    {"item": "Pasta", "qty": "5 kg", "unit_price": "€1.75/kg"},
                    {"item": "Rice", "qty": "8 kg", "unit_price": "€1.45/kg"},
                ],
            },
        ],
    },
    "analyst_phase1": {
        "waste_report": {
            "money_saved_eur": 123,
            "waste_per_capita_pct": 10,
            "deflection_potential_pct": 70,
            "daily_average_kg": 12.2,
            "by_food_type": [
                {"item": "Salmon", "qty_kg": 2, "cost_eur": 16.00},
                {"item": "Salad greens", "qty_kg": 1.5, "cost_eur": 3.00},
                {"item": "Bread", "qty_kg": 3, "cost_eur": 1.20},
            ],
            "by_waste_type": [
                {"type": "Wrong order", "qty_kg": 2, "cost_eur": 9.00},
                {"type": "Plate waste", "qty_kg": 2, "cost_eur": 8.00},
                {"type": "Over-prep", "qty_kg": 1, "cost_eur": 4.00},
            ],
            "eaten_ratio": 8,
            "wasted_ratio": 2,
            "eaten_pct": 80,
            "vs_last_week_pct": 4,
        },
        "recommendations": [
            "Reduce Monday perishable orders by 25% — rainy Mondays consistently produce the most waste",
            "Reduce bread batch size on weekdays by 10 loaves — consistent over-prep pattern detected",
        ],
        "surplus_items": [
            {"item": "Salmon", "surplus_qty": "0.5 kg", "give_qty": "0.5", "expires_in": "in 5 days", "stock_level": "red"},
            {"item": "Sandwich", "surplus_qty": "1 pcs", "give_qty": "1 pcs", "expires_in": "in 5 days", "stock_level": "green"},
            {"item": "Dairy", "surplus_qty": "1 L", "give_qty": "1 L", "expires_in": "in 5 days", "stock_level": "red"},
            {"item": "Bread", "surplus_qty": "2 units", "give_qty": "2 units", "expires_in": "in 5 days", "stock_level": "yellow"},
        ],
        "distribute_status": [
            {"item": "Salad greens", "expires": "3d", "expires_level": "yellow", "original_price": 5.00, "sell_price": 1.00, "money_saved": 1.50, "status": "messaged", "platform": "4 platforms"},
            {"item": "Bread", "expires": "3d", "expires_level": "yellow", "original_price": 5.00, "sell_price": 1.00, "money_saved": 1.50, "status": "confirmed", "platform": "ResQ"},
            {"item": "Dairy", "expires": "1d", "expires_level": "red", "original_price": 5.00, "sell_price": 1.00, "money_saved": 1.50, "status": "not_messaged", "platform": None},
        ],
    },
    "deflection": {
        "surplus_items": [
            {"item": "Salmon", "qty": "0.5 kg", "expires": "2026-05-28", "channel": "resq", "reason": "Premium protein, sells well on ResQ"},
            {"item": "Sandwich", "qty": "1 pcs", "expires": "2026-05-28", "channel": "resq", "reason": "Ready-to-eat, attractive for ResQ"},
            {"item": "Dairy", "qty": "1 L", "expires": "2026-05-28", "channel": "shelter", "reason": "Bulk dairy for shelter donation"},
            {"item": "Bread", "qty": "2 units", "expires": "2026-05-28", "channel": "resq", "reason": "Baked goods sell well on ResQ"},
        ],
        "resq_listing": {
            "title": "Chef's Surprise Box — Linh's Bakery",
            "description": "Fresh salmon + artisan bread. A quality meal at 50% off.",
            "original_price_eur": 9.90, "discounted_price_eur": 4.90, "portions": 8, "pickup_window": "17:30–19:00",
        },
        "shelter_message": {
            "subject": "Food donation available — Linh's Bakery",
            "body": "Hello,\n\nWe have dairy products (1L) available for donation today. Food-safe for 5 more days.\n\nPlease confirm if you can collect.\n\nBest regards,\nLinh's Bakery via Sesonki.AI",
        },
        "sms_summary": "Sesonki.AI: 8 ResQ portions listed (pickup 17:30-19:00). Shelter contacted for dairy donation. Tap to view.",
    },
    "analyst_phase2": {
        "deflection_summary": {
            "total_surplus_kg": 4.5,
            "successfully_deflected_kg": 3.5,
            "final_waste_kg": 1.0,
            "deflection_rate_pct": 77.8,
        },
        "items_still_wasted": [
            {"item": "Bread", "qty": "1 unit", "reason": "Not collected from ResQ"},
        ],
        "feedback_to_procurement": "Reduce bread order by 2 units for next cycle. All other surplus was fully utilised.",
        "waste_cost_eur": 3.40,
        "saved_vs_no_deflection_eur": 12.80,
    },
}


async def _mock_response(agent: str) -> dict:
    await asyncio.sleep(1.5 + 0.5 * (hash(agent) % 3))
    return MOCK_RESULTS[agent]


# ── Health & data ─────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok", "agents": 4, "service": "shopwise-crewai", "demo_mode": DEMO_MODE}


@app.get("/api/data/{dataset}")
async def get_data(dataset: str):
    allowed = {"inventory", "pos", "suppliers", "external_factors", "config"}
    if dataset not in allowed:
        raise HTTPException(404, f"Unknown dataset: {dataset}")
    return json.loads((DATA_DIR / f"{dataset}.json").read_text())


# ── Config endpoints ──────────────────────────────────────────

@app.get("/api/config")
async def get_config():
    return json.loads((DATA_DIR / "config.json").read_text())


@app.put("/api/config/schedule")
async def update_schedule(req: ScheduleUpdate):
    from crew import load_config, save_config
    config = load_config()
    config["scheduling"]["procurement_trigger"]["mode"] = req.mode
    config["scheduling"]["procurement_trigger"]["auto_interval_days"] = req.auto_interval_days
    config["scheduling"]["procurement_trigger"]["auto_time"] = req.auto_time
    save_config(config)
    return {"status": "updated", "scheduling": config["scheduling"]["procurement_trigger"]}


@app.put("/api/config/suppliers")
async def update_supplier_source(req: SupplierSourceUpdate):
    from crew import load_config, save_config
    config = load_config()
    config["supplier_config"]["source"] = req.source
    save_config(config)
    return {"status": "updated", "source": req.source}


# ── Agent 1: Procurement ──────────────────────────────────────

@app.post("/api/agent/procurement", response_model=AgentResponse)
async def agent_procurement(req: AgentRequest):
    if DEMO_MODE:
        return AgentResponse(status="completed", agent="procurement", result=await _mock_response("procurement"))
    try:
        from crew import run_procurement_crew
        result = run_procurement_crew()
        return AgentResponse(status="completed", agent="procurement", result=result)
    except Exception as e:
        raise HTTPException(500, detail=str(e))


# ── Agent 2: Purchasing ───────────────────────────────────────

@app.post("/api/agent/purchasing", response_model=AgentResponse)
async def agent_purchasing(req: AgentRequest):
    if DEMO_MODE:
        return AgentResponse(status="completed", agent="purchasing", result=await _mock_response("purchasing"))
    try:
        from crew import run_purchasing_crew
        result = run_purchasing_crew(order_context=req.context or "")
        return AgentResponse(status="completed", agent="purchasing", result=result)
    except Exception as e:
        raise HTTPException(500, detail=str(e))


# ── Agent 3 Phase 1: Pre-pickup ───────────────────────────────

@app.post("/api/agent/analyst/phase1", response_model=AgentResponse)
async def agent_analyst_phase1(req: AgentRequest):
    if DEMO_MODE:
        return AgentResponse(status="completed", agent="analyst_phase1", result=await _mock_response("analyst_phase1"))
    try:
        from crew import run_analyst_phase1_crew
        result = run_analyst_phase1_crew()
        return AgentResponse(status="completed", agent="analyst_phase1", result=result)
    except Exception as e:
        raise HTTPException(500, detail=str(e))


# ── Agent 3 Phase 2: Post-pickup ──────────────────────────────

@app.post("/api/agent/analyst/phase2", response_model=AgentResponse)
async def agent_analyst_phase2(req: AgentRequest):
    if DEMO_MODE:
        return AgentResponse(status="completed", agent="analyst_phase2", result=await _mock_response("analyst_phase2"))
    try:
        from crew import run_analyst_phase2_crew
        result = run_analyst_phase2_crew()
        return AgentResponse(status="completed", agent="analyst_phase2", result=result)
    except Exception as e:
        raise HTTPException(500, detail=str(e))


# ── Agent 4: Deflection ──────────────────────────────────────

@app.post("/api/agent/deflection", response_model=AgentResponse)
async def agent_deflection(req: AgentRequest):
    if DEMO_MODE:
        return AgentResponse(status="completed", agent="deflection", result=await _mock_response("deflection"))
    try:
        from crew import run_deflection_crew
        result = run_deflection_crew(waste_context=req.context or "")
        return AgentResponse(status="completed", agent="deflection", result=result)
    except Exception as e:
        raise HTTPException(500, detail=str(e))


# ── Owner validation ──────────────────────────────────────────

NEXT_STEP = {
    "procurement": "purchasing",
    "purchasing": "auto_order",
    "analyst_phase1": "deflection",
    "deflection": "send_notifications_then_wait_for_pickup",
    "analyst_phase2": "feedback_to_agent1",
}

@app.post("/api/validate")
async def validate_action(req: ValidateRequest):
    if req.approved:
        return {
            "status": "approved",
            "agent": req.agent,
            "message": f"Owner approved {req.agent}. Proceeding.",
            "next_step": NEXT_STEP.get(req.agent, "done"),
        }
    return {
        "status": "rejected",
        "agent": req.agent,
        "message": f"Owner rejected {req.agent}. Revising.",
        "next_step": "revise",
    }


@app.on_event("startup")
async def startup_msg():
    mode = "DEMO (mock data)" if DEMO_MODE else "LIVE (CrewAI + LLM)"
    print(f"\n  ShopWise backend running in {mode} mode\n")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
