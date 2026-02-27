from pydantic import BaseModel

class TrainingPlanInput(BaseModel):
    injury_risk: str  # LOW, MEDIUM, HIGH
    performance_score: int
    fatigue_score: int
    recovery_score: int
