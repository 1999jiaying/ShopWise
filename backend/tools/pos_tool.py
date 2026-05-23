import json
from pathlib import Path
from crewai.tools import tool

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


@tool("read_pos_sales")
def read_pos_sales(days: int = 4) -> str:
    """Read the last N days of POS (point-of-sale) sales data.
    Returns daily covers, revenue, and per-menu-item quantities sold.
    Also includes ingredient usage ratios per menu item so you can
    calculate raw-ingredient demand from forecasted covers.
    """
    data = json.loads((DATA_DIR / "pos_sales.json").read_text())
    sales = data["daily_sales"][-days:]
    usage = data["ingredient_usage_per_item"]
    return json.dumps({"daily_sales": sales, "ingredient_usage_per_item": usage}, indent=2)


@tool("get_ingredient_usage_map")
def get_ingredient_usage_map() -> str:
    """Return the mapping of menu items to their raw-ingredient quantities.
    Use this to translate a sales forecast into a raw-ingredient order list.
    """
    data = json.loads((DATA_DIR / "pos_sales.json").read_text())
    return json.dumps(data["ingredient_usage_per_item"], indent=2)
