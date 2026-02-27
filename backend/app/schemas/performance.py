from pydantic import BaseModel

class PerformanceInput(BaseModel):
    training_load: int
    heart_rate: int
    session_duration: int
    sleep_hours: float
    fatigue_score: int
    recovery_score: int
