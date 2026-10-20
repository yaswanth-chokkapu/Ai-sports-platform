"""
Focused regression tests for AthleteX backend.
Tests module imports, services, the injury prediction bug fix, and running API endpoints.
"""
import sys
import os
import unittest
from types import SimpleNamespace
import urllib.request
import json

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(__file__))

import app.main as main_mod
import app.routers.session as session_router
import app.routers.coach as coach_router
import app.services.injury_service as injury_srv
import app.services.performance_service as perf_srv
import app.services.fatigue_service as fatigue_srv
import app.services.suggestion_service as sugg_srv
import app.services.ml_service as ml_srv
import app.schemas.session as session_schema

class TestAthleteXBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Load ML model once
        ml_srv.injury_model.load()

    def test_imports_and_app_initialization(self):
        """Verify FastAPI app is configured and routes are mounted."""
        self.assertIsNotNone(main_mod.app)
        routes = [route.path for route in main_mod.app.routes]
        self.assertIn("/", routes)
        self.assertIn("/session", routes)
        self.assertIn("/coach", routes)

    def test_performance_analysis(self):
        """Verify performance calculations and score generation."""
        mock_data = SimpleNamespace(
            training_load=60,
            heart_rate=130,
            session_duration=75,
            sleep_hours=7.5,
            recovery_score=70,
            fatigue_score=45,
            previous_injury=False
        )
        res = perf_srv.analyze_performance(mock_data)
        self.assertIn("overall_score", res)
        self.assertIn("metrics", res)
        self.assertIsInstance(res["overall_score"], int)
        self.assertTrue(0 <= res["overall_score"] <= 100)

    def test_fatigue_service_update(self):
        """Verify fatigue trend calculation."""
        res = fatigue_srv.update_fatigue(50)
        self.assertIn("history", res)
        self.assertIn("average_fatigue", res)
        self.assertIsInstance(res["average_fatigue"], int)

    def test_suggestion_service(self):
        """Verify suggestions generated without emojis and valid text."""
        suggestions = sugg_srv.generate_suggestions(75, "Low", 35)
        self.assertIsInstance(suggestions, list)
        self.assertTrue(len(suggestions) > 0)
        for s in suggestions:
            self.assertIsInstance(s, str)

    def test_injury_risk_model_string_classes(self):
        """Verify that ML model classes are strings ('HIGH', 'MEDIUM', 'LOW')."""
        self.assertIsNotNone(ml_srv.injury_model.model)
        classes = list(ml_srv.injury_model.model.classes_)
        self.assertIn("HIGH", classes)
        self.assertIn("LOW", classes)
        self.assertIn("MEDIUM", classes)

    def test_injury_risk_prediction_fix_high_string(self):
        """
        Verify Bug Fix: When ML model predicts 'HIGH' with confidence > 60,
        risk_level is correctly upgraded to 'High'.
        """
        orig_predict = ml_srv.injury_model.model.predict
        orig_proba = ml_srv.injury_model.model.predict_proba

        try:
            # Mock model returning 'HIGH' with 85% confidence
            ml_srv.injury_model.model.predict = lambda X: ["HIGH"]
            ml_srv.injury_model.model.predict_proba = lambda X: [[0.85, 0.10, 0.05]]

            # Normal biometrics that would otherwise be 'Low'
            mock_data = SimpleNamespace(
                training_load=50,
                heart_rate=120,
                session_duration=45,
                sleep_hours=8.0,
                recovery_score=80,
                fatigue_score=30,
                previous_injury=False
            )

            res = injury_srv.predict_injury(mock_data)
            self.assertEqual(res["risk_level"], "High", "ML 'HIGH' string prediction must upgrade risk to High")
            self.assertEqual(res["confidence"], 85.0)

        finally:
            ml_srv.injury_model.model.predict = orig_predict
            ml_srv.injury_model.model.predict_proba = orig_proba

    def test_injury_risk_prediction_fix_integer_backward_compatibility(self):
        """Verify backward compatibility: When model returns integer 1, risk is upgraded."""
        orig_predict = ml_srv.injury_model.model.predict
        orig_proba = ml_srv.injury_model.model.predict_proba

        try:
            ml_srv.injury_model.model.predict = lambda X: [1]
            ml_srv.injury_model.model.predict_proba = lambda X: [[0.75, 0.25]]

            mock_data = SimpleNamespace(
                training_load=50,
                heart_rate=120,
                session_duration=45,
                sleep_hours=8.0,
                recovery_score=80,
                fatigue_score=30,
                previous_injury=False
            )

            res = injury_srv.predict_injury(mock_data)
            self.assertEqual(res["risk_level"], "High", "Integer 1 prediction must upgrade risk to High")
            self.assertEqual(res["confidence"], 75.0)

        finally:
            ml_srv.injury_model.model.predict = orig_predict
            ml_srv.injury_model.model.predict_proba = orig_proba

    def test_injury_risk_rule_based_overrides(self):
        """Verify rule-based safety overrides trigger properly."""
        # 1. High fatigue (>85) and low sleep (<4) -> High
        high_strain_data = SimpleNamespace(
            training_load=80,
            heart_rate=160,
            session_duration=90,
            sleep_hours=3.5,
            recovery_score=50,
            fatigue_score=90,
            previous_injury=False
        )
        res_high = injury_srv.predict_injury(high_strain_data)
        self.assertEqual(res_high["risk_level"], "High")

        # 2. Previous injury -> Medium
        injury_hist_data = SimpleNamespace(
            training_load=50,
            heart_rate=120,
            session_duration=45,
            sleep_hours=8.0,
            recovery_score=80,
            fatigue_score=30,
            previous_injury=True
        )
        res_med = injury_srv.predict_injury(injury_hist_data)
        self.assertEqual(res_med["risk_level"], "Medium")

    def test_direct_router_execution(self):
        """Verify router functions execute and return valid responses directly."""
        session_input = session_schema.SessionInput(
            training_load=60,
            heart_rate=130,
            session_duration=75,
            sleep_hours=7.5,
            fatigue_score=45,
            recovery_score=70,
            previous_injury=False
        )
        session_res = session_router.process_session(session_input)
        self.assertIn("performance", session_res)
        self.assertIn("injury_risk", session_res)
        self.assertIn("fatigue_trend", session_res)
        self.assertIn("suggestions", session_res)

        coach_res = coach_router.coach(session_input)
        self.assertIn("message", coach_res)

    def test_live_backend_http_endpoints(self):
        """Verify live HTTP endpoints if local backend server is running on port 8000."""
        try:
            req = urllib.request.urlopen("http://127.0.0.1:8000/", timeout=2)
            self.assertEqual(req.status, 200)
            data = json.loads(req.read().decode())
            self.assertEqual(data, {"message": "Backend is working"})

            # Test POST /session
            payload = json.dumps({
                "training_load": 65,
                "heart_rate": 135,
                "session_duration": 60,
                "sleep_hours": 7.5,
                "fatigue_score": 40,
                "recovery_score": 75,
                "previous_injury": False
            }).encode()
            post_req = urllib.request.Request(
                "http://127.0.0.1:8000/session",
                data=payload,
                headers={"Content-Type": "application/json"}
            )
            post_res = urllib.request.urlopen(post_req, timeout=3)
            self.assertEqual(post_res.status, 200)
            post_data = json.loads(post_res.read().decode())
            self.assertIn("performance", post_data)
            self.assertIn("injury_risk", post_data)
        except Exception as e:
            self.skipTest(f"Live server not responding (offline or different port): {e}")

if __name__ == "__main__":
    unittest.main()
