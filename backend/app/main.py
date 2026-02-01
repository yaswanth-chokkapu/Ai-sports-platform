from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.ml_service import injury_model
from app.routers import session
from app.routers import coach


app = FastAPI()

# ✅ CORS MUST BE HERE (GLOBAL, BEFORE ROUTES)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Startup event ONLY for ML loading
@app.on_event("startup")
def load_ml_model():
    injury_model.load()

# ✅ Routers
app.include_router(session.router)
app.include_router(coach.router)

@app.get("/")
def root():
    return {"message": "Backend is working"}


