"""
ShopWise — standalone CrewAI crew builders.

Each agent runs independently. No Flow chaining.
Trigger modes:
  - Agent 1+2: manual OR auto-scheduled (daily / 2 days / weekly)
  - Agent 3 Phase 1: auto at analyst_trigger_time (e.g. 17:00)
  - Agent 4: manual after reviewing Phase 1 results
  - Agent 3 Phase 2: auto after pickup_deadline (e.g. 19:45)
"""

import json
from pathlib import Path

from crewai import Crew, Process

from agents.procurement_agent import build_procurement_agent
from agents.purchasing_agent import build_purchasing_agent
from agents.analyst_agent import build_analyst_agent
from agents.deflection_agent import build_deflection_agent

from tasks.procurement_tasks import create_order_list_task, allocation_plan_task
from tasks.purchasing_tasks import compare_suppliers_task
from tasks.analyst_tasks import waste_report_phase1_task, waste_report_phase2_task, waste_forecast_task
from tasks.deflection_tasks import surplus_deflection_task

DATA_DIR = Path(__file__).parent / "data"


def load_config() -> dict:
    return json.loads((DATA_DIR / "config.json").read_text())


def save_config(config: dict):
    (DATA_DIR / "config.json").write_text(json.dumps(config, indent=2))


# ── Agent 1: Procurement (manual or scheduled) ───────────────

def run_procurement_crew() -> dict:
    agent = build_procurement_agent()
    order_task = create_order_list_task(agent)
    alloc_task = allocation_plan_task(agent)

    crew = Crew(
        agents=[agent],
        tasks=[order_task, alloc_task],
        process=Process.sequential,
        verbose=True,
    )
    result = crew.kickoff()
    return {
        "order_list": str(order_task.output) if order_task.output else "",
        "allocation_plan": str(alloc_task.output) if alloc_task.output else "",
        "raw": str(result),
    }


# ── Agent 2: Purchasing (manual or scheduled, same as Agent 1)

def run_purchasing_crew(order_context: str = "") -> dict:
    agent = build_purchasing_agent()
    task = compare_suppliers_task(agent)
    if order_context:
        task.description = (
            f"The procurement agent produced this approved order:\n"
            f"{order_context}\n\n"
            f"{task.description}"
        )

    crew = Crew(
        agents=[agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True,
    )
    result = crew.kickoff()
    return {"purchasing_plan": str(result)}


# ── Agent 3 Phase 1: Pre-pickup (auto at analyst_trigger_time)

def run_analyst_phase1_crew() -> dict:
    agent = build_analyst_agent()
    p1_task = waste_report_phase1_task(agent)
    f_task = waste_forecast_task(agent)

    crew = Crew(
        agents=[agent],
        tasks=[p1_task, f_task],
        process=Process.sequential,
        verbose=True,
    )
    result = crew.kickoff()
    return {
        "waste_report_phase1": str(p1_task.output) if p1_task.output else "",
        "waste_forecast": str(f_task.output) if f_task.output else "",
        "raw": str(result),
    }


# ── Agent 3 Phase 2: Post-pickup (auto after pickup_deadline)

def run_analyst_phase2_crew() -> dict:
    agent = build_analyst_agent()
    p2_task = waste_report_phase2_task(agent)

    crew = Crew(
        agents=[agent],
        tasks=[p2_task],
        process=Process.sequential,
        verbose=True,
    )
    result = crew.kickoff()
    return {
        "waste_report_phase2": str(p2_task.output) if p2_task.output else "",
        "raw": str(result),
    }


# ── Agent 4: Deflection (manual, after reviewing Phase 1) ────

def run_deflection_crew(waste_context: str = "") -> dict:
    agent = build_deflection_agent()
    task = surplus_deflection_task(agent)
    if waste_context:
        task.description = (
            f"Context from the waste analyst (Phase 1):\n{waste_context}\n\n"
            f"{task.description}"
        )

    crew = Crew(
        agents=[agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True,
    )
    result = crew.kickoff()
    return {"deflection_plan": str(result)}
