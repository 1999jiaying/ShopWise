from crewai import Task, Agent


def compare_suppliers_task(agent: Agent) -> Task:
    return Task(
        description=(
            "You receive an approved order list from the Procurement agent.\n"
            "1. Fetch all supplier catalogs.\n"
            "2. Price the full basket against each supplier.\n"
            "3. Flag any items that are unavailable at certain suppliers.\n"
            "4. Recommend the best purchasing plan — this may split the order "
            "   across suppliers if that yields savings while meeting delivery "
            "   constraints.\n"
            "5. Present a clear comparison for owner approval.\n"
        ),
        expected_output="""{
  "supplier_comparison": [
    {
      "supplier": "<name>",
      "total_eur": <float>,
      "delivery": "<schedule>",
      "all_items_available": <bool>,
      "savings_vs_most_expensive": <float>
    }
  ],
  "recommendation": {
    "strategy": "single_supplier | split_order",
    "primary_supplier": "<name>",
    "total_cost_eur": <float>,
    "estimated_delivery": "<schedule>",
    "reasoning": "<why this is the best option>"
  },
  "order_details": [
    {
      "ingredient": "<key>",
      "label": "<name>",
      "qty": <float>,
      "unit": "<unit>",
      "supplier": "<name>",
      "unit_price": <float>,
      "line_total": <float>
    }
  ]
}""",
        agent=agent,
    )
