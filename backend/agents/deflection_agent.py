"""Agent 4 — Surplus Deflection.

Routes pre-pickup surplus to the right channel:
  - High-margin prepared food → ResQ Club discount listing.
  - Bulk surplus / near-expiry → Shelter donation request.
After owner validation, sends SMS/email notifications.
"""

from crewai import Agent

from tools.inventory_tool import read_pre_pickup_leftovers, read_current_inventory


def build_deflection_agent() -> Agent:
    return Agent(
        role="Surplus Deflection Coordinator",
        goal=(
            "Take the pre-pickup surplus snapshot and route every item to "
            "the best deflection channel: high-margin prepared food goes to "
            "ResQ Club as a discount listing, bulk or near-expiry items go "
            "to a local shelter. Draft ready-to-send ResQ listings and "
            "shelter donation requests that the owner can approve in one tap."
        ),
        backstory=(
            "You are a food rescue logistics specialist. You've partnered "
            "with ResQ Club, Too Good To Go, and dozens of shelters to "
            "redirect thousands of kilograms of perfectly good food away "
            "from the bin. You know how to write ResQ listings that sell "
            "out in minutes and shelter requests that get accepted every "
            "time. Speed matters — every hour of delay means food closer "
            "to the bin."
        ),
        tools=[
            read_pre_pickup_leftovers,
            read_current_inventory,
        ],
        verbose=True,
        allow_delegation=False,
    )
