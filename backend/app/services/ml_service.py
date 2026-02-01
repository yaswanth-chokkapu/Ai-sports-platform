import joblib
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..", "ml", "injury_model.pkl"
)

class InjuryRiskModel:
    def __init__(self):
        self.model = None

    def load(self):
        self.model = joblib.load(MODEL_PATH)
        print("✅ Injury ML model loaded successfully")

    def predict(self, features):
        return self.model.predict(features)[0]


injury_model = InjuryRiskModel()
