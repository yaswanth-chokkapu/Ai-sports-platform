from app.services.ml_service import injury_model

def predict_injury(data):
    features = [[
        data.training_load,
        data.heart_rate,
        data.session_duration,
        data.sleep_hours,
        data.fatigue_score,
        data.recovery_score,
        int(data.previous_injury)
    ]]

    prediction = injury_model.model.predict(features)[0]
    confidence = max(injury_model.model.predict_proba(features)[0]) * 100

    # 🔥 Rule-based overrides (PRODUCT LOGIC)
    risk_level = "Low"

    if (
        data.fatigue_score > 70 or
        data.sleep_hours < 5 or
        data.recovery_score < 30 or
        data.previous_injury
    ):
        risk_level = "Medium"

    if (
        data.fatigue_score > 85 and
        data.sleep_hours < 4
    ):
        risk_level = "High"

    # ML can still upgrade risk
    if prediction == 1 and confidence > 60:
        risk_level = "High"

    return {
        "risk_level": risk_level,
        "confidence": round(confidence, 2)
    }
