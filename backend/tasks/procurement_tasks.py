from crewai import Task, Agent


def create_order_list_task(agent: Agent) -> Task:
    return Task(
        description=(
            "1. Read the last 4 days of POS sales data.\n"
            "2. Read today's external factors (weather, holidays, events).\n"
            "3. Read the current morning inventory snapshot.\n"
            "4. Using the ingredient-usage-per-menu-item map, forecast today's "
            "   raw-ingredient demand based on expected covers.\n"
            "5. Subtract current inventory from forecasted demand to get the "
            "   net order quantities.\n"
            "6. For perishable items with short shelf life, apply a safety "
            "   reduction factor if conditions suggest lower traffic.\n"
            "7. Produce a structured order list.\n"
        ),
        expected_output="""{
  "headline": "One punchy sentence summarising today's order strategy",
  "reasoning": "2-3 sentences justifying the approach",
  "expected_covers": <int>,
  "items": [
    {
      "ingredient": "<ingredient_key>",
      "label": "<human-readable name>",
      "unit": "<kg, L, or pcs>",
      "base_demand": <float>,
      "on_hand": <float>,
      "suggested_order": <float>,
      "reduction_reason": "<why reduced, or null>"
    }
  ]
}""",
        agent=agent,
    )


def allocation_plan_task(agent: Agent) -> Task:
    return Task(
        description=(
            "Based on the order list you just created and today's expected "
            "covers, produce a daily allocation plan that tells the kitchen "
            "how much of each ingredient to prep for lunch vs. dinner service."
        ),
        expected_output="""{
  "date": "2026-05-23",
  "expected_covers": { "lunch": <int>, "dinner": <int> },
  "allocation": [
    {
      "ingredient": "<ingredient_key>",
      "label": "<name>",
      "lunch_allocation": <float>,
      "dinner_allocation": <float>,
      "unit": "<unit>"
    }
  ]
}""",
        agent=agent,
    )
