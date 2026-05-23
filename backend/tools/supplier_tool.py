import json
from pathlib import Path
from crewai.tools import tool

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _load_config():
    return json.loads((DATA_DIR / "config.json").read_text())


def _load_suppliers():
    """Load suppliers based on config source mode.
    - user_provided: reads suppliers.json (manually maintained by owner)
    - auto_fetch: in production would scrape/API wholesaler sites;
      for now falls back to suppliers.json with a note.
    """
    config = _load_config()
    source = config["supplier_config"]["source"]

    suppliers = json.loads((DATA_DIR / "suppliers.json").read_text())["suppliers"]

    if source == "auto_fetch":
        enabled = [
            w["name"]
            for w in config["supplier_config"]["auto_fetch_wholesalers"]
            if w["enabled"]
        ]
        note = (
            f"Auto-fetch mode: would query live prices from {enabled}. "
            f"Currently using cached catalog data."
        )
        return suppliers, note

    return suppliers, "Using owner-provided supplier data from suppliers.json."


@tool("get_supplier_catalog")
def get_supplier_catalog() -> str:
    """Get all supplier catalogs with prices, availability, delivery schedules,
    and minimum order amounts. The data source depends on config:
    - user_provided: reads from owner's manually maintained file.
    - auto_fetch: would query live wholesaler APIs/sites (cached for demo).
    """
    suppliers, source_note = _load_suppliers()
    return json.dumps({
        "source_note": source_note,
        "suppliers": suppliers,
    }, indent=2)


@tool("price_order_basket")
def price_order_basket(order_json: str) -> str:
    """Given an order basket as JSON (list of {"ingredient": str, "qty": float}),
    price it against every supplier and return a comparison.
    Returns each supplier's total, item-level breakdown, and availability flags.
    """
    order_items = json.loads(order_json)
    suppliers, source_note = _load_suppliers()

    results = []
    for supplier in suppliers:
        total = 0.0
        breakdown = []
        all_available = True
        for item in order_items:
            ing = item["ingredient"]
            qty = item["qty"]
            cat_entry = supplier["catalog"].get(ing)
            if not cat_entry or not cat_entry.get("available") or cat_entry.get("price") is None:
                all_available = False
                breakdown.append({"ingredient": ing, "qty": qty, "available": False, "line_total": None})
            else:
                line = round(cat_entry["price"] * qty, 2)
                total += line
                breakdown.append({"ingredient": ing, "qty": qty, "price": cat_entry["price"], "line_total": line, "available": True})

        results.append({
            "supplier": supplier["name"],
            "delivery": supplier["delivery_schedule"],
            "min_order": supplier["minimum_order_eur"],
            "total_eur": round(total, 2),
            "all_items_available": all_available,
            "breakdown": breakdown,
        })

    return json.dumps({"source_note": source_note, "comparison": results}, indent=2)
