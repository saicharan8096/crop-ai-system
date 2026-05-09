"""
routes/weather.py — Live Weather Data
=======================================
Endpoint: GET /api/weather/current?city=Delhi
- Fetches real-time weather from OpenWeatherMap API
- Returns temperature, humidity, rainfall, wind speed
"""

import os
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Put your API key in backend/.env file:
# OPENWEATHER_API_KEY=your_key_here
# Sign up free at: https://openweathermap.org/api
OPENWEATHER_KEY = os.getenv("OPENWEATHER_API_KEY", "demo")


class WeatherData(BaseModel):
    city: str
    temperature_c: float
    humidity_pct: float
    rainfall_1h_mm: float
    wind_speed_ms: float
    description: str
    icon: str          # weather icon code e.g. "01d" (clear sky day)


@router.get("/current", response_model=WeatherData)
def get_weather(city: str = "Delhi"):
    """
    Fetch current weather for a city.
    
    Usage: GET /api/weather/current?city=Hyderabad
    
    Returns live weather data from OpenWeatherMap.
    If API key is not set, returns mock data for development.
    """

    # ── Mock data for development (when API key not set) ─────────────────────
    if OPENWEATHER_KEY == "demo":
        return WeatherData(
            city=city,
            temperature_c=29.5,
            humidity_pct=68.0,
            rainfall_1h_mm=0.0,
            wind_speed_ms=3.2,
            description="Partly cloudy",
            icon="02d",
        )

    # ── Real API call ─────────────────────────────────────────────────────────
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q":     city,
        "appid": OPENWEATHER_KEY,
        "units": "metric",   # Celsius
    }

    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.HTTPError:
        raise HTTPException(status_code=404, detail=f"City '{city}' not found.")
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=503, detail="Weather service unavailable.")

    # Extract the fields we need
    rainfall = 0.0
    if "rain" in data and "1h" in data["rain"]:
        rainfall = data["rain"]["1h"]

    return WeatherData(
        city=data["name"],
        temperature_c=round(data["main"]["temp"], 1),
        humidity_pct=data["main"]["humidity"],
        rainfall_1h_mm=rainfall,
        wind_speed_ms=round(data["wind"]["speed"], 1),
        description=data["weather"][0]["description"].capitalize(),
        icon=data["weather"][0]["icon"],
    )
