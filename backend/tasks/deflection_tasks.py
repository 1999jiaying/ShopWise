from crewai import Task, Agent


def surplus_deflection_task(agent: Agent) -> Task:
    return Task(
        description=(
            "1. Read the end-of-day leftover inventory.\n"
            "2. Categorise each leftover by deflection channel:\n"
            "   - High-margin prepared food → ResQ Club discount listing.\n"
            "   - Bulk surplus / near-expiry → Shelter donation.\n"
            "3. Draft a ResQ Club listing (product name, description, price, "
            "   pickup window).\n"
            "4. Draft a professional shelter donation request (email/SMS body).\n"
            "5. Prepare an SMS summary for the owner to approve.\n"
        ),
        expected_output="""{
  "surplus_items": [
    {
      "item": "<name>",
      "qty": "<amount>",
      "expires": "<datetime>",
      "channel": "resq | shelter",
      "reason": "<why this channel>"
    }
  ],
  "resq_listing": {
    "title": "<listing title>",
    "description": "<appetising description>",
    "original_price_eur": <float>,
    "discounted_price_eur": <float>,
    "portions": <int>,
    "pickup_window": "<time range>"
  },
  "shelter_message": {
    "subject": "<email subject>",
    "body": "<professional donation request body>",
    "food_items": "<summary of what's available>",
    "pickup_deadline": "<time>"
  },
  "sms_summary": "<short SMS text for owner confirmation>"
}""",
        agent=agent,
    )
