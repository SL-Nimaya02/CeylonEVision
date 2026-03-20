# CeylonEVision: AI-Driven EV Charging Navigation System

CeylonEVision is a research-backed, AI-driven navigation system designed to optimize electric vehicle (EV) charging in Sri Lanka. It leverages Deep Reinforcement Learning (DRL) to provide strategic and emergency charging recommendations tailored to user preferences and real-world conditions.

## 🚀 Features

- **AI-Optimized Recommendations**: Powered by a Proximal Policy Optimization (PPO) model.
- **Dynamic Scoring Engine**: Considers distance, charger power, price, and real-time urgency.
- **Interactive Dashboard**: Real-time map integration with Leaflet.
- **Vehicle Profiles**: Pre-defined profiles for popular EVs in Sri Lanka (MG ZS EV, Nissan Leaf, etc.).
- **Strategic & Emergency Modes**: Automatically switches logic based on current battery levels.

## 🏗️ Architecture

The project is structured as a monorepo with three main components:

- **`frontend/`**: React + Vite dashboard with interactive maps.
- **`backend/`**: Flask API that serves the AI model and handles geocoding.
- **`DRL - Model/`**: Research scripts and the core reinforcement learning model logic.

## 📂 Project Structure

```
CeylonEVision/
├── backend/              # Flask API & Scoring Engine
│   ├── app.py            # Main API entry point
│   ├── data/             # EV Station datasets (.csv)
│   └── models/           # Trained AI models (.zip, .pkl)
├── frontend/             # React Dashboard
│   ├── src/              # Source code (Components, Hooks, etc.)
│   └── public/           # Static assets
├── DRL - Model/          # DRL Research & Training logic
│   └── ceylonevision.py  # Model definition
├── .gitignore            # Root-level ignore rules
└── README.md             # This file
```

## 🛠️ Setup & Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
*The backend runs on `http://localhost:8000`.*

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
*The frontend runs on `http://localhost:5173`.*

## 🧠 AI Brain

The system uses a **PPO (Proximal Policy Optimization)** model trained on Sri Lankan EV station connectivity and power availability. The model is synchronized with the `sl_ev_stations_2026.csv` dataset.

- **Observation Space**: [Lat, Lon, Battery %, Urgent, Budget, Reward]
- **Action Space**: Discrete choice of optimal charging stations.

## 📄 License

This project is developed for research purposes under the FYP CEVision initiative.
