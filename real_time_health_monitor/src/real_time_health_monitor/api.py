from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import os
import sys
from datetime import datetime
from typing import List
import pandas as pd

# Add src to path so CrewAI imports work
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from real_time_health_monitor.crew import RealTimeHealthMonitor
from real_time_health_monitor.simulator import VitalsSimulator

app = FastAPI(title="VitalGuard API")

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory state ──────────────────────────────────────────
current_vitals = {}
current_risk_score = 0
current_assessment = "Normal"
decision_log = []
active_alerts = []
triggered_actions = []
connected_clients: List[WebSocket] = []

# ── WebSocket manager ────────────────────────────────────────
async def broadcast(data: dict):
    disconnected = []
    for client in connected_clients:
        try:
            await client.send_text(json.dumps(data))
        except:
            disconnected.append(client)
    for client in disconnected:
        connected_clients.remove(client)

@app.websocket("/ws/vitals")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    # Send current state immediately on connect
    await websocket.send_text(json.dumps({
        "type": "initial_state",
        "vitals": current_vitals,
        "risk_score": current_risk_score,
        "assessment": current_assessment,
        "decision_log": decision_log[-20:],
        "active_alerts": active_alerts,
        "triggered_actions": triggered_actions[-3:]
    }))
    try:
        while True:
            await websocket.receive_text()  # keep connection alive
    except WebSocketDisconnect:
        connected_clients.remove(websocket)

# ── REST endpoints ───────────────────────────────────────────
@app.get("/api/vitals/current")
def get_current_vitals():
    return current_vitals

@app.get("/api/risk-score")
def get_risk_score():
    return {"risk_score": current_risk_score, "assessment": current_assessment}

@app.get("/api/decision-log")
def get_decision_log():
    return decision_log[-20:]

@app.get("/api/alerts/active")
def get_active_alerts():
    return active_alerts

@app.get("/api/actions/recent")
def get_recent_actions():
    return triggered_actions[-3:]

@app.post("/api/emergency/override")
async def emergency_override():
    action = {
        "type": "emergency_call",
        "description": "Manual emergency override triggered",
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "status": "Completed"
    }
    triggered_actions.append(action)
    await broadcast({"type": "action_triggered", "action": action})
    return {"status": "Emergency override triggered"}

# ── Risk score calculator ────────────────────────────────────
def calculate_risk_score(agent2_output: dict) -> int:
    if agent2_output.get("assessment") == "Normal":
        return 10
    findings = agent2_output.get("findings", [])
    if not findings:
        return 20
    top_confidence = findings[0].get("confidence", "0%")
    score = int(top_confidence.replace("%", "").strip())
    # Scale to 0-100
    if score > 70:
        return 85
    elif score > 40:
        return 55
    else:
        return 30

# ── Main pipeline loop ───────────────────────────────────────
async def run_pipeline():
    global current_vitals, current_risk_score, current_assessment

    csv_path = r"D:\hackanova\vitals_monitoring_system\kaggle_dataset.csv"
    simulator = VitalsSimulator(csv_path, interval_seconds=10)

    while True:
        row = simulator.get_next_row()
        vitals_input = simulator.format_vitals_input(row)

        # Update current vitals for dashboard
        current_vitals = {
            "heart_rate": row["Heart_Rate"],
            "spo2": row["Blood_Oxygen"],
            "temperature": row["Body_Temperature"],
            "blood_pressure": {
                "display": row["Blood_Pressure"],
                "systolic": int(row["Blood_Pressure"].split("/")[0]),
                "diastolic": int(row["Blood_Pressure"].split("/")[1])
            },
            "hrv": row["HRV"],
            "activity_status": row["Activity_Status"].capitalize(),
            "latitude": row["Latitude"],
            "longitude": row["Longitude"],
            "timestamp": datetime.now().isoformat()
        }

        # Broadcast raw vitals immediately
        await broadcast({
            "type": "vitals_update",
            "data": current_vitals
        })

        try:
            # Run CrewAI pipeline
            result = await asyncio.to_thread(
                RealTimeHealthMonitor().crew().kickoff,
                inputs={"vitals_input": vitals_input}
            )

            # Parse Agent 2 output for risk score
            tasks_output = result.tasks_output
            agent2_raw = tasks_output[1].pydantic
            agent2_dict = agent2_raw.dict() if agent2_raw else {}

            current_assessment = agent2_dict.get("assessment", "Normal")
            current_risk_score = calculate_risk_score(agent2_dict)

            # Build decision log entry
            log_entry = {
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "agent": "Risk Assessment Agent",
                "decision": agent2_dict.get("logic_summary", "Analysis complete"),
                "triggers": [v["name"] for v in tasks_output[0].pydantic.dict().get("vitals", []) if v["status"] == "Abnormal"],
                "confidence": agent2_dict.get("findings", [{}])[0].get("confidence", "N/A") if agent2_dict.get("findings") else "N/A",
                "action": tasks_output[2].raw if tasks_output[2].raw else "Logged only"
            }
            decision_log.append(log_entry)

            # Broadcast full update
            await broadcast({
                "type": "analysis_complete",
                "risk_score": current_risk_score,
                "assessment": current_assessment,
                "log_entry": log_entry
            })

            # Handle alerts
            if current_risk_score > 80:
                alert = {
                    "severity": "critical",
                    "message": f"CRITICAL: {agent2_dict.get('logic_summary', 'Critical vitals detected')}",
                    "timestamp": datetime.now().strftime("%H:%M:%S")
                }
                active_alerts.append(alert)
                await broadcast({"type": "alert", "alert": alert})

        except Exception as e:
            print(f"Pipeline error: {e}")
            await broadcast({
                "type": "error",
                "message": str(e)
            })

        await asyncio.sleep(simulator.interval)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(run_pipeline())