"""Agent 3 — Waste Analyst.

Two-phase operation:
  Phase 1 (at analyst_trigger_time, e.g. 17:00):
    Generate initial waste report from pre-pickup surplus snapshot.
    Trigger Agent 4 for deflection.

  Phase 2 (after pickup_deadline, e.g. 19:45):
    Update waste report with post-pickup results (what was NOT collected).
    Feed the final waste report back to Agent 1 for next-day adjustments.
"""

from crewai import Agent

from tools.inventory_tool import (
    read_current_inventory,
    read_pre_pickup_leftovers,
    read_post_pickup_results,
    read_waste_log,
)


def build_analyst_agent() -> Agent:
    return Agent(
        role="Waste Analyst",
        goal=(
            "Analyse inventory leftovers and historical waste data in two phases: "
            "(1) At trigger time, produce an initial waste report from the "
            "pre-pickup surplus snapshot and forecast waste trends. "
            "(2) After the pickup deadline, read post-pickup results to see "
            "what was collected vs wasted, then produce a final waste report "
            "with feedback for the procurement agent."
        ),
        backstory=(
            "You are a data-driven food-waste analyst who has helped dozens "
            "of restaurants identify exactly where and why food gets wasted. "
            "You work in two passes: first you flag surplus before pickups "
            "happen (so Agent 4 can route it), then after pickups you "
            "reconcile what was actually rescued vs binned. Your final "
            "report feeds directly back to procurement, closing the loop."
        ),
        tools=[
            read_current_inventory,
            read_pre_pickup_leftovers,
            read_post_pickup_results,
            read_waste_log,
        ],
        verbose=True,
        allow_delegation=False,
    )
