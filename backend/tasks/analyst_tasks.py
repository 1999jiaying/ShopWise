from crewai import Task, Agent


def waste_report_phase1_task(agent: Agent) -> Task:
    """Phase 1: Pre-pickup waste report (at analyst_trigger_time)."""
    return Task(
        description=(
            "PHASE 1 — Pre-pickup analysis.\n"
            "1. Read the waste log for the last 7 days.\n"
            "2. Read the pre-pickup surplus snapshot (leftovers before any "
            "   ResQ/shelter collection happens).\n"
            "3. Identify waste trends: which days are worst, which items are "
            "   most wasted, and estimate root causes.\n"
            "4. Calculate total waste in kg and EUR for the period.\n"
            "5. Produce a structured initial waste report.\n"
            "This report is shared with Agent 4 for surplus deflection.\n"
        ),
        expected_output="""{
  "phase": "pre_pickup",
  "period": "2026-05-17 to 2026-05-22",
  "total_waste_kg": <float>,
  "total_waste_eur": <float>,
  "daily_average_kg": <float>,
  "worst_day": { "date": "<date>", "waste_kg": <float>, "likely_cause": "<str>" },
  "trend": "increasing | decreasing | stable",
  "top_wasted_categories": ["<category1>", "<category2>"],
  "current_surplus_items": <int>,
  "current_surplus_value_eur": <float>,
  "recommendations": ["<actionable suggestion 1>", "<suggestion 2>"]
}""",
        agent=agent,
    )


def waste_report_phase2_task(agent: Agent) -> Task:
    """Phase 2: Post-pickup updated waste report (after pickup_deadline)."""
    return Task(
        description=(
            "PHASE 2 — Post-pickup reconciliation.\n"
            "1. Read the post-pickup results to see what was collected by "
            "   ResQ customers and shelter volunteers.\n"
            "2. Calculate the FINAL waste: what was NOT picked up.\n"
            "3. Compare pre-pickup surplus vs actual waste to measure "
            "   deflection effectiveness.\n"
            "4. Generate specific feedback for Agent 1 (procurement) on "
            "   what to adjust in future orders.\n"
            "This final report feeds back to Agent 1 for next-day planning.\n"
        ),
        expected_output="""{
  "phase": "post_pickup",
  "deflection_summary": {
    "total_surplus_kg": <float>,
    "successfully_deflected_kg": <float>,
    "final_waste_kg": <float>,
    "deflection_rate_pct": <float>,
    "resq_collected_kg": <float>,
    "shelter_collected_kg": <float>
  },
  "items_still_wasted": [
    { "item": "<name>", "qty": "<amount>", "reason": "<why not collected>" }
  ],
  "feedback_to_procurement": "<specific 2-3 sentence recommendation for Agent 1 to adjust orders>"
}""",
        agent=agent,
    )


def waste_forecast_task(agent: Agent) -> Task:
    return Task(
        description=(
            "Using the 7-day waste log and current inventory data, forecast "
            "expected waste for the next 3 days. Factor in shelf-life "
            "countdowns for perishable items currently on hand.\n"
            "This forecast feeds back to Agent 1 to adjust future orders.\n"
        ),
        expected_output="""{
  "forecast": [
    {
      "date": "<date>",
      "predicted_waste_kg": <float>,
      "predicted_waste_eur": <float>,
      "at_risk_items": [
        { "ingredient": "<name>", "qty_at_risk": <float>, "reason": "<why at risk>" }
      ]
    }
  ],
  "feedback_to_procurement": "<1-2 sentence recommendation for Agent 1>"
}""",
        agent=agent,
    )
