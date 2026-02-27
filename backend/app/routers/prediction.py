from fastapi import APIRouter
from app.schemas.prediction import InjuryPredictionInput
from app.services.ml_service import injury_model

router = APIRouter()

@router.post("/prediction")
def predict_injury(data: InjuryPredictionInput):

    features = [[
        data.training_load,
        data.heart_rate,
        data.session_duration,
        data.sleep_hours,
        data.fatigue_score,
        data.recovery_score,
        data.previous_injury
    ]]

    risk = injury_model.predict(features)

    if risk == "LOW":
        recommendation = "You are safe to train today."
    elif risk == "MEDIUM":
        recommendation = "Reduce intensity by 15% and focus on recovery."
    else:
        recommendation = "High injury risk detected. Rest is recommended."

    return {
        "injury_risk": risk,
        "recommendation": recommendation
    }

    