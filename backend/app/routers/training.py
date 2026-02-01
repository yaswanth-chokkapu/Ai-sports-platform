from fastapi import APIRouter
from app.schemas.training import TrainingPlanInput
from app.services.training_service import generate_training_plan

router = APIRouter()

@router.post("/training")
def get_training_plan(data: TrainingPlanInput):
    return generate_training_plan(data)
