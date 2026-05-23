import json
from pathlib import Path
from crewai.tools import tool

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


@tool("get_external_factors")
def get_external_factors() -> str:
    """Get today's external factors: weather forecast, holidays, local events,
    and historical traffic patterns for similar conditions.
    Use this to adjust demand predictions up or down.
    """
    data = json.loads((DATA_DIR / "external_factors.json").read_text())
    return json.dumps(data, indent=2)
