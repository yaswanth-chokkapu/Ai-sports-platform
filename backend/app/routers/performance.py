from fastapi import APIRouter
from app.schemas.performance import PerformanceInput
from app.services.performance_service import calculate_performance

router = APIRouter()

@router.post("/performance")
def check_performance(data: PerformanceInput):
    return calculate_performance(data)
 