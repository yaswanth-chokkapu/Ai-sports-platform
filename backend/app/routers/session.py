from fastapi import APIRouter
from app.schemas.session import SessionInput
from app.services.performance_service import analyze_performance
from app.services.injury_service import predict_injury
from app.services.fatigue_service import update_fatigue
from app.services.suggestion_service import generate_suggestions

router = APIRouter()

@router.post("/session")
def process_session(data: SessionInput):
    # 1️⃣ Analyze overall performance (returns a dict)
    performance = analyze_performance(data)
    performance_score = performance["overall_score"]

    # 2️⃣ Predict injury risk (returns a dict)
    injury = predict_injury(data)
    injury_risk_level = injury["risk_level"]

    # 3️⃣ Update fatigue trend (returns a dict)
    fatigue_trend = update_fatigue(data.fatigue_score)
    avg_fatigue = fatigue_trend["average_fatigue"]

    # 4️⃣ Generate suggestions using ONLY numbers
    suggestions = generate_suggestions(
        performance_score,
        injury_risk_level,
        avg_fatigue
    )

    # 5️⃣ Final combined response
    return {
        "performance": performance,
        "injury_risk": injury,
        "fatigue_trend": fatigue_trend,
        "suggestions": suggestions
    }

