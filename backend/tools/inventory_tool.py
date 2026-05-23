import json
from pathlib import Path
from crewai.tools import tool

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


@tool("read_current_inventory")
def read_current_inventory() -> str:
    """Read the current morning inventory snapshot.
    Returns each ingredient's on-hand quantity, unit, shelf life,
    and cost per unit. Use this to decide what needs reordering
    and what's at risk of expiring.
    """
    data = json.loads((DATA_DIR / "inventory.json").read_text())
    return json.dumps({
        "snapshot_date": data["snapshot_date"],
        "snapshot_time": data["snapshot_time"],
        "items": data["items"],
    }, indent=2)


@tool("read_pre_pickup_leftovers")
def read_pre_pickup_leftovers() -> str:
    """Read the pre-pickup surplus snapshot (generated at analyst_trigger_time,
    e.g. 17:00). These are the leftovers available for deflection via ResQ
    Club or shelter donation BEFORE any pickups happen.
    """
    data = json.loads((DATA_DIR / "inventory.json").read_text())
    return json.dumps(data["pre_pickup_snapshot"], indent=2)


@tool("read_post_pickup_results")
def read_post_pickup_results() -> str:
    """Read the post-pickup snapshot (generated after pickup_deadline).
    Shows what was collected vs what remains. The 'final_waste' section
    contains items that went to waste despite deflection efforts.
    The 'feedback_to_agent_1' field should be forwarded to the
    procurement agent for next-day order adjustments.
    """
    data = json.loads((DATA_DIR / "inventory.json").read_text())
    return json.dumps(data["post_pickup_snapshot"], indent=2)


@tool("read_waste_log")
def read_waste_log() -> str:
    """Read the waste log for the last 7 days.
    Shows daily wasted kg and their EUR value.
    Use this to identify waste trends and forecast future waste.
    """
    data = json.loads((DATA_DIR / "inventory.json").read_text())
    return json.dumps(data["waste_log_last_7_days"], indent=2)
