"""
CeylonEVision Backend: AI-Driven EV Charging Navigation System
Synchronized with Reference Research Logic (Cell 12)
"""

import os
import re
import requests
import numpy as np
import pandas as pd
import pickle
import warnings
from flask import Flask, request, jsonify
from flask_cors import CORS
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv, VecNormalize
import gymnasium as gym
from geopy.geocoders import Nominatim
from math import radians, cos, sin, asin, sqrt, atan2
from datetime import datetime

# Research environment suppression
warnings.filterwarnings("ignore", category=DeprecationWarning)

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION (Synced with Local Assets) ---
MODEL_FILE = os.path.join("models", "ppo_colombo_ipd_final.zip")
VEC_NORM_FILE = os.path.join("models", "vec_normalize_v4.pkl")
STATION_FILE = os.path.join("data", "sl_ev_stations_2026.csv")

# --- VEHICLE PROFILES (Synced with Frontend) ---
VEHICLE_PROFILES = {
    "MG ZS EV (44.5kWh)": {"capacity": 44.5, "drain_rate": 0.18},
    "MG ZS EV Long Range (72.6kWh)": {"capacity": 72.6, "drain_rate": 0.19},
    "Nissan Leaf (24kWh)": {"capacity": 24.0, "drain_rate": 0.16},
    "Nissan Leaf (40kWh)": {"capacity": 40.0, "drain_rate": 0.17},
    "Hyundai Kona (39.2kWh)": {"capacity": 39.2, "drain_rate": 0.15},
    "BYD Atto 3 (60.5kWh)": {"capacity": 60.5, "drain_rate": 0.18},
    "Tesla Model 3 (60kWh)": {"capacity": 60.0, "drain_rate": 0.14},
    "Other (40kWh)": {"capacity": 40.0, "drain_rate": 0.22}
}

class GeoLocator:
    def __init__(self):
        self.geolocator = Nominatim(user_agent="sl_ev_research_v6_final")

    def get_live_coords(self, city_name):
        try:
            location = self.geolocator.geocode(f"{city_name}, Sri Lanka", timeout=10)
            return (location.latitude, location.longitude) if location else None
        except: return None

    def haversine(self, lon1, lat1, lon2, lat2):
        lon1, lat1, lon2, lat2 = map(radians, [float(lon1), float(lat1), float(lon2), float(lat2)])
        dlon, dlat = lon2 - lon1, lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        return 2 * asin(sqrt(a)) * 6371

class EVNavigator:
    def __init__(self):
        self.geo = GeoLocator()
        self.df = self.load_data()
        self.model, self.vec_norm = self.load_ai_brain()

    def load_data(self):
        if os.path.exists(STATION_FILE):
            df = pd.read_csv(STATION_FILE)
            print(f"✅ Research Dataset Synced: {len(df)} stations active.")
            return df
        else:
            print("⚠️ WARNING: STATION_FILE not found!")
            return pd.DataFrame()

    def load_ai_brain(self):
        try:
            # 1. LOAD THE PPO MODEL
            model = PPO.load(MODEL_FILE, device='cpu')

            # 2. MATCHING ENVIRONMENT (Fixes the 'df' attribute error)
            class SimpleEnv(gym.Env):
                def __init__(self, stations_df):
                    super().__init__()
                    self.df = stations_df  # Required by some VecNormalize versions
                    self.observation_space = gym.spaces.Box(low=-1000, high=5000, shape=(6,), dtype=np.float32)
                    self.action_space = gym.spaces.Discrete(len(self.df) if not self.df.empty else 1)
                def reset(self, seed=None): return np.zeros((6,), dtype=np.float32), {}

            def make_simple_env():
                return SimpleEnv(self.df)

            dummy_env = DummyVecEnv([make_simple_env])

            # 3. LOAD THE NORMALIZER
            vec_norm = VecNormalize.load(VEC_NORM_FILE, dummy_env)
            vec_norm.training = False
            vec_norm.norm_reward = False

            print("✅ AI BRAIN FIXED: Structure synchronized and Normalizer loaded.")
            return model, vec_norm
        except Exception as e:
            print(f"⚠️ AI BRAIN ERROR: {e}")
            return None, None

    def get_recommendations(self, city, battery, urgent, budget, user_lat=None, user_lon=None, vehicle_model=None):
        if self.df.empty: return {"error": "Station database uninitialized."}

        # Resolve spatial context
        u_lat, u_lon = 0.0, 0.0
        if user_lat is not None and user_lon is not None:
            u_lat, u_lon = float(user_lat), float(user_lon)
        else:
            coords = self.geo.get_live_coords(city)
            if not coords:
                return {"error": f"City '{city}' not found in Sri Lanka."}
            u_lat, u_lon = coords

        # 1. CALCULATE DISTANCES
        self.df['Distance_KM'] = self.df.apply(
            lambda r: self.geo.haversine(u_lon, u_lat, r['Longitude'], r['Latitude']), axis=1
        )

        # 2. PHYSICAL CONTEXT
        profile = VEHICLE_PROFILES.get(vehicle_model, VEHICLE_PROFILES["Other (40kWh)"])
        battery_capacity = profile["capacity"]
        drain_rate = profile["drain_rate"]
        
        available_energy = (battery / 100.0) * battery_capacity

        # 3. AI PREDICTION
        raw_obs = np.array([[float(u_lat), float(u_lon), float(battery), 0.0, 0.0, 0.0]], dtype=np.float32)
        ai_idx = -1
        if self.model and self.vec_norm:
            norm_obs = self.vec_norm.normalize_obs(raw_obs)
            ai_action, _ = self.model.predict(norm_obs, deterministic=True)
            ai_idx = int(ai_action)

        # 4. MULTI-OBJECTIVE SCORING ENGINE (Exact Cell 12 Match)
        is_emergency = battery < 15.0
        results: list[dict] = []

        for idx, st in self.df.iterrows():
            score = 0
            
            # --- FACTOR A: NEAREST FIRST ---
            dist_penalty = 1200.0 if is_emergency else 100.0
            score -= (st['Distance_KM'] * dist_penalty)

            # --- FACTOR B: TIME (Power_KW) ---
            time_saving_bonus = float(st.get('Power_KW', 0)) * 12
            if urgent: time_saving_bonus *= 2.5
            score += time_saving_bonus

            # --- FACTOR C: PRICE ---
            if budget:
                if any(cheap in str(st['Price_Details']) for cheap in ['60', '70', '80', '85']):
                    score += 2000

            # --- FACTOR D: AI & REACHABILITY ---
            is_ai = (idx == ai_idx)
            if is_ai: score += 2500

            energy_needed = st['Distance_KM'] * drain_rate
            if energy_needed > (available_energy * 0.9):
                score -= 100000

            # Simulation for UI display (Traffic)
            traffic = self._sim_traffic(st['Distance_KM'])

            # --- DYNAMIC METRICS CALCULATION ---
            energy_at_station = max(0, available_energy - (st['Distance_KM'] * drain_rate))
            energy_to_charge = battery_capacity - energy_at_station
            
            # Extract Unit Price (Regex for first currency-like value in Price_Details)
            # Example: "Day : 83.08 LKR/kWh" -> 83.08
            unit_price = 80.0
            price_match = re.search(r'(\d+\.\d+)', str(st.get('Price_Details', '')))
            if price_match:
                unit_price = float(price_match.group(1))

            results.append({
                "stationName": str(st['Name']),
                "town": str(st['Town']),
                "distance": round(float(st['Distance_KM']), 2),
                "power": float(st['Power_KW']),
                "is_safety_choice": is_ai,
                "score": float(score),
                "latitude": float(st['Latitude']),
                "longitude": float(st['Longitude']),
                "priceRate": str(st['Price_Details']),
                "contact": str(st['Phone']),
                "connector": str(st['Equipment_Spec']),
                "reason": "🌟 [AI OPTIMIZED]" if is_ai else "🛡️ [SAFETY CHOICE]",
                "travelTime": traffic['travel'],
                "waitTime": int((energy_to_charge / st['Power_KW']) * 60) if st['Power_KW'] > 0 else 120,
                "cost": int(energy_to_charge * unit_price),
                "trafficStatus": traffic['status'],
                "trafficColor": traffic['color'],
                "delay": traffic['delay'],
                "confidence": 99 if is_ai else 85
            })

        # --- FINAL SORTING: BY SCORE (Cell 12 Requirement) ---
        results.sort(key=lambda x: x['score'], reverse=True)
        mode_label = "🚨 EMERGENCY" if is_emergency else "🟢 STRATEGIC"
        
        return {
            "status": "success",
            "mode": mode_label,
            "city": city.upper(),
            "battery": f"{battery}%",
            "preferences": {"urgent": "Yes" if urgent else "No", "budget": "Yes" if budget else "No"},
            "recommendations": results[:5]
        }

    def _sim_traffic(self, dist):
        hour = datetime.now().hour
        is_peak = (8 <= hour <= 9) or (17 <= hour <= 19)
        speed = 20 if is_peak else 40
        travel = round((dist / speed) * 60)
        delay = round(travel * 0.4) if is_peak else 0
        return {
            "travel": travel,
            "delay": delay,
            "status": "Heavy" if is_peak else "Light",
            "color": "#FF4D4D" if is_peak else "#2ECC71"
        }

# --- API ENDPOINTS ---
nav_system = EVNavigator()

@app.route('/api/recommend', methods=['POST']) 
def predict():
    data = request.json
    if not isinstance(data, dict):
        return jsonify({"status": "error", "message": "Invalid input format"}), 400
        
    result = nav_system.get_recommendations(
        data.get('city', 'Colombo'), 
        float(data.get('battery', 45)), 
        data.get('urgent', False), 
        data.get('budget', True),
        data.get('latitude'),  
        data.get('longitude'),
        data.get('vehicle_model')
    )
    return jsonify(result)

if __name__ == '__main__':
    # Fixed Port 8000
    app.run(debug=True, port=8000)