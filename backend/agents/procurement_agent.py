"""Agent 1 — Procurement / Demand Planning.

Reads POS history + external factors (weather, holidays) and produces:
  1. A recommended order list (ingredient, qty) for owner validation.
  2. An allocation plan per day (how much of each ingredient to use per service).
"""

from crewai import Agent

from tools.pos_tool import read_pos_sales, get_ingredient_usage_map
from tools.weather_tool import get_external_factors
from tools.inventory_tool import read_current_inventory


def build_procurement_agent() -> Agent:
    return Agent(
        role="Procurement & Demand Planner",
        goal=(
            "Analyse POS sales history, current inventory levels, and today's "
            "external factors (weather, holidays, events) to produce a precise "
            "raw-ingredient order list that minimises waste while keeping the "
            "kitchen fully stocked for forecasted demand."
        ),
        backstory=(
            "You are a seasoned restaurant supply-chain analyst. You've spent "
            "years optimising procurement for high-volume kitchens. You know "
            "that ordering too much leads to spoilage and waste, while ordering "
            "too little means 86'd menu items and lost revenue. You combine "
            "historical sales data with weather and event signals to hit the "
            "sweet spot every single day."
        ),
        tools=[
            read_pos_sales,
            get_ingredient_usage_map,
            get_external_factors,
            read_current_inventory,
        ],
        verbose=True,
        allow_delegation=False,
    )
