TOOLS = [
    {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "parameters": {"city": "string"}
    },
    {
        "name": "calculate",
        "description": "Perform mathematical calculations",
        "parameters": {"expression": "string"}
    },
    {
        "name": "convert_currency",
        "description": "Convert currency from one to another",
        "parameters": {
            "from_currency": "string",
            "to_currency": "string",
            "amount": "number"
        }
    },
    {
        "name": "get_news",
        "description": "Get latest news on a topic",
        "parameters": {"topic": "string"}
    }
]