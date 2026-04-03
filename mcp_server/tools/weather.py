import requests

def get_weather(city: str):
    try:
        # Step 1: Convert city → latitude & longitude (Geocoding)
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}"
        geo_res = requests.get(geo_url).json()

        if "results" not in geo_res:
            return f"Could not find location for {city}"

        lat = geo_res["results"][0]["latitude"]
        lon = geo_res["results"][0]["longitude"]

        # Step 2: Get current weather
        weather_url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}&current_weather=true"
        )

        weather_res = requests.get(weather_url).json()

        current = weather_res.get("current_weather", {})

        temp = current.get("temperature")
        wind = current.get("windspeed")

        return f"Weather in {city}: {temp}°C, Wind Speed: {wind} km/h"

    except Exception as e:
        return f"Error fetching weather: {str(e)}"