# CeylonEVision: AI-Driven EV Charging Navigation System

CeylonEVision is a research-backed, AI-driven navigation system designed to optimize electric vehicle (EV) charging in Sri Lanka. It balances multiple physical and economic parameters using Deep Reinforcement Learning (DRL) to provide strategic and emergency recommendations tailored to human preferences.

## 🚀 Key Features

- **4-Objective AI Balancing**: Powered by a Proximal Policy Optimization (PPO) agent that dynamically weights:
  - 🔋 **Battery State**: Energy reachability guards and SoC safety margins.
  - 🚗 **Distance**: Proximity factors (up to 12x penalty in Emergency Mode).
  - ⚡ **Power (Time)**: Optimizer bonuses for high-kW chargers (boosted 2.5x if urgent).
  - 💰 **Cost (Economic)**: Strategic bonuses for budget-friendly charging stations.
- **Arrival-Aware Cost Estimation**: Calculates the estimated cost to reach a **100% full charge** from the arrival battery level at any station.
- **Intelligent Modes**: 
  - **🚨 Emergency Mode**: Activated below 15% SoC with safety-first logic.
  - **🟢 Strategic Mode**: Balanced optimization for daily trip planning.
  - *Dynamic: Choice of optimization preferences (Time vs. Cost) remains active even in low-battery states.*
- **Interactive Multi-Model Dashboard**:
  - Real-time station tracking with Leaflet maps.
  - Personalized Logic rationales for every recommendation.
  - Clean kW display for curated alternatives with expanded connector details.
- **Vehicle Charging Profiles**: Integrated support for MG ZS EV, Nissan Leaf, Tesla Model 3, Hyundai Kona, BYD Atto 3, and more.

## 🏗️ Architecture

The project is structured as a synchronized monorepo:

- **`frontend/`**: React (Vite/TypeScript) dashboard with Lucide icons and Tailwind CSS layout.
- **`backend/`**: Flask-based API orchestrating the multi-objective scoring engine and station geocoding.
- **`DRL - Model/`**: Core research scripts, Gymnasium environments, and the PPO model logic.
- **`models/`**: Serialized Brain (`.zip`) and Observation Normalizers (`.pkl`).

## 📂 Project Structure

```
CeylonEVision/
├── backend/              # Flask API & Multi-Objective Scoring
│   ├── app.py            # Reference Research logic (Cell 18 Synced)
│   ├── data/             # Latest sl_ev_stations_2026.csv dataset
│   └── models/           # Pre-trained PPO Agent models
├── frontend/             # High-fidelity React Dashboard
│   ├── src/              # Components (Sidebar, Maps, Dashboard)
│   └── public/           # Static geospatial assets
├── DRL - Model/          # DRL Research & Training Environment
│   └── ceylonevision.py  # Model definition & Objective weights
├── .gitignore            # Version control exclusions
└── README.md             # Project Documentation
```

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Backend Setup (Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
*Backend initializes the AI brain on `http://localhost:8000`.*

### 2. Frontend Setup (React/Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend interface available on `http://localhost:5173`.*

## 🧠 The AI Brain

The system uses a **PPO (Proximal Policy Optimization)** model trained on the Ceylon Electricity Board (CEB) and private network datasets for Sri Lanka.

- **Obs Space**: [UserLat, UserLon, CurrentBattery%, TimeUrgent, BudgetSearch, ReachabilityScore]
- **Action Space**: Ranked choice of stations based on multi-objective score synchronization.
- **Reward Function**: Simultaneously minimizes travel time/distance while maximizing energy-per-rupee utility.

## 📄 Research Context
Developed for research purposes under the FYP CEVision initiative. The agent successfully evaluates physical and economic parameters simultaneously to ensure driver safety and trip efficiency.
