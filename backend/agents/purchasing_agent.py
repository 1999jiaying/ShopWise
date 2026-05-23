"""Agent 2 — Purchasing / Smart Sourcing.

Takes the validated order list from Agent 1, prices it across all suppliers,
and selects the cheapest option that meets delivery constraints.
After owner validation, places the order automatically.
"""

from crewai import Agent

from tools.supplier_tool import get_supplier_catalog, price_order_basket


def build_purchasing_agent() -> Agent:
    return Agent(
        role="Purchasing & Supplier Sourcing Specialist",
        goal=(
            "Take the approved ingredient order list, compare prices across "
            "all available suppliers, and recommend the best purchasing plan "
            "that minimises cost while meeting delivery time requirements."
        ),
        backstory=(
            "You are a procurement negotiation expert who has managed supplier "
            "relationships for restaurant chains. You know every trick to get "
            "the best price: bulk discounts, delivery timing, minimum order "
            "thresholds. You always present the owner with a clear comparison "
            "so they can approve with confidence."
        ),
        tools=[
            get_supplier_catalog,
            price_order_basket,
        ],
        verbose=True,
        allow_delegation=False,
    )
