from fastapi import APIRouter
from app.schemas.session import SessionInput
from app.services.coach_service import generate_coach_feedback

router = APIRouter(prefix="/coach")

@router.post("")
def coach(data: SessionInput):
    feedback = generate_coach_feedback(data)
    return {"message": feedback}
