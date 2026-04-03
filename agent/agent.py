import json
import re

from llm.gemini_client import ask_gemini
from mcp_client.client import execute_tool
from mcp_client.tools_registry import TOOLS
from memory.memory_store import add_message, get_history
from rag.retriever import retrieve


WEATHER_PATTERNS = [
    re.compile(r"\bwhat(?:'s| is)\s+the\s+weather\s+(?:in|at|for)\s+(?P<city>[a-zA-Z][a-zA-Z\s.-]*)", re.IGNORECASE),
    re.compile(r"\bweather\s+(?:in|at|for)\s+(?P<city>[a-zA-Z][a-zA-Z\s.-]*)", re.IGNORECASE),
    re.compile(r"\btemperature\s+(?:in|at|for)\s+(?P<city>[a-zA-Z][a-zA-Z\s.-]*)", re.IGNORECASE),
]


def _extract_weather_city(query: str):
    cleaned_query = query.strip()

    for pattern in WEATHER_PATTERNS:
        match = pattern.search(cleaned_query)
        if match:
            city = match.group("city").strip(" ?!.,")
            if city:
                return city

    return None


def _call_tool(tool_name: str, params: dict):
    result = execute_tool(tool_name, params)
    add_message("assistant", result)
    return {"answer": result}


def _safe_ask_gemini(prompt: str):
    try:
        return ask_gemini(prompt), None
    except Exception as exc:
        message = str(exc)
        lowered = message.lower()

        if "resourceexhausted" in lowered or "quota" in lowered or "429" in lowered:
            return None, "Gemini quota is exhausted right now. Please retry shortly, or use a direct tool query like weather, calculator, currency, or news."

        return None, f"Gemini request failed: {message}"

def agent(query: str):

    # 🧠 Add user query to memory
    add_message("user", query)

    history = get_history()

    # Convert history to text
    history_text = "\n".join([f"{m['role']}: {m['content']}" for m in history])

    tool_prompt = f"""
You are an AI agent.

Conversation history:
{history_text}

Available tools:
{TOOLS}

STRICT RULES:
- Only return valid JSON
- No explanation
- No extra text

Format:
{{
  "tool": "tool_name",
  "parameters": {{
    "key": "value"
  }}
}}

If no tool:
{{
  "tool": "none"
}}

Query: {query}
"""

    decision = ask_gemini(tool_prompt)

    decision = decision.strip().replace("```json", "").replace("```", "")

    try:
        decision_json = json.loads(decision)
    except:
        return {"error": "Failed to parse LLM response", "raw": decision}

    tool_name = decision_json.get("tool")

    # 🔌 TOOL EXECUTION
    if tool_name and tool_name != "none":
        params = decision_json.get("parameters", {})
        result = execute_tool(tool_name, params)

        add_message("assistant", result)

        return {"answer": result}

    # 🧠 RAG + MEMORY
    context = retrieve(query)

    prompt = f"""
Conversation history:
{history_text}

Context:
{context}

Question: {query}
"""

    answer = ask_gemini(prompt)

    add_message("assistant", answer)

    return {"answer": answer}


def agent(query: str):
    add_message("user", query)

    city = _extract_weather_city(query)
    if city:
        return _call_tool("get_weather", {"city": city})

    history = get_history()
    history_text = "\n".join([f"{m['role']}: {m['content']}" for m in history])

    tool_prompt = f"""
You are an AI agent.

Conversation history:
{history_text}

Available tools:
{TOOLS}

STRICT RULES:
- Only return valid JSON
- No explanation
- No extra text

Format:
{{
  "tool": "tool_name",
  "parameters": {{
    "key": "value"
  }}
}}

If no tool:
{{
  "tool": "none"
}}

Query: {query}
"""

    decision, error = _safe_ask_gemini(tool_prompt)
    if error:
        add_message("assistant", error)
        return {"error": error}

    decision = decision.strip().replace("```json", "").replace("```", "")

    try:
        decision_json = json.loads(decision)
    except Exception:
        return {"error": "Failed to parse LLM response", "raw": decision}

    tool_name = decision_json.get("tool")

    if tool_name and tool_name != "none":
        params = decision_json.get("parameters", {})
        return _call_tool(tool_name, params)

    from rag.retriever import retrieve

    context = retrieve(query)

    prompt = f"""
Conversation history:
{history_text}

Context:
{context}

Question: {query}
"""

    answer, error = _safe_ask_gemini(prompt)
    if error:
        add_message("assistant", error)
        return {"error": error}

    add_message("assistant", answer)
    return {"answer": answer}
