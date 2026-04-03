from mcp_server.tools.weather import get_weather
from mcp_server.tools.calculator import calculate
from mcp_server.tools.currency import convert_currency
from mcp_server.tools.news import get_news

def execute_tool(tool_name, params):

    if tool_name == "get_weather":
        return get_weather(params.get("city"))

    if tool_name == "calculate":
        return calculate(params.get("expression"))

    if tool_name == "convert_currency":
        return convert_currency(
            params.get("from_currency"),
            params.get("to_currency"),
            float(params.get("amount"))
        )

    if tool_name == "get_news":
        return get_news(params.get("topic"))

    return "Unknown tool"