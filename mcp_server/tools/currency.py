import requests

def convert_currency(from_currency: str, to_currency: str, amount: float):
    try:
        url = f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{from_currency.lower()}.json"
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # raises error for bad HTTP status
        
        data = response.json()

        base = from_currency.lower()
        target = to_currency.lower()

        rate = data[base][target]
        converted = amount * rate

        return f"{amount} {from_currency.upper()} = {converted:.2f} {to_currency.upper()}"

    except requests.exceptions.RequestException as e:
        return f"Network/API error: {str(e)}"
    except ValueError:
        return "Error: Invalid JSON response from API"
    except KeyError:
        return "Error: Currency not found in API response"
    except Exception as e:
        return f"Unexpected error: {str(e)}"