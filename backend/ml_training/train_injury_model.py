import pandas as pd
import joblib
import os
from sklearn.ensemble import RandomForestClassifier

# -----------------------------
# Dataset
# -----------------------------
data = {
    "training_load": [40, 60, 80, 90, 70, 85, 30, 50, 95, 65],
    "heart_rate": [120, 135, 150, 165, 140, 155, 110, 130, 170, 145],
    "session_duration": [30, 45, 60, 75, 50, 70, 25, 40, 80, 55],
    "sleep_hours": [8, 7, 5, 4, 6, 5, 8, 7, 4, 6],
    "fatigue_score": [2, 4, 7, 9, 6, 8, 2, 3, 9, 5],
    "recovery_score": [8, 6, 4, 3, 5, 4, 9, 8, 2, 6],
    "previous_injury": [0, 0, 1, 1, 0, 1, 0, 0, 1, 0],
    "injury_risk": ["LOW", "MEDIUM", "HIGH", "HIGH", "MEDIUM", "HIGH", "LOW", "LOW", "HIGH", "MEDIUM"]
}

df = pd.DataFrame(data)

X = df.drop("injury_risk", axis=1)
y = df["injury_risk"]

# -----------------------------
# Train model
# -----------------------------
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# -----------------------------
# Save model (SAFE PATH)
# -----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "app", "ml", "injury_model.pkl")

joblib.dump(model, MODEL_PATH)

print("✅ Injury model trained and saved successfully")
