from pydantic import BaseModel

class SessionInput(BaseModel):
    training_load: int
    heart_rate: int
    session_duration: int
    sleep_hours: float
    fatigue_score: int
    recovery_score: int
    previous_injury: bool
