import json
from pathlib import Path
from crewai.tools import tool

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


@tool("read_config")
def read_config() -> str:
    """Read the ShopWise configuration: scheduling settings (how often
    agents run, trigger times), supplier source mode (user_provided vs
    auto_fetch), and pickup deadlines.
    """
    data = json.loads((DATA_DIR / "config.json").read_text())
    return json.dumps(data, indent=2)
