def generate_training_plan(data):

    plan = {
        "focus": "",
        "intensity": "",
        "workout_plan": [],
        "notes": []
    }

    # Injury risk takes highest priority
    if data.injury_risk == "HIGH":
        plan["focus"] = "Recovery & Mobility"
        plan["intensity"] = "Low"
        plan["workout_plan"] = [
            "Light stretching (15 min)",
            "Mobility drills",
            "Breathing exercises",
            "Optional walk (20 min)"
        ]
        plan["notes"].append("High injury risk detected. Avoid intense training.")

        return plan

    # Medium risk
    if data.injury_risk == "MEDIUM":
        plan["focus"] = "Controlled Training"
        plan["intensity"] = "Medium"
        plan["workout_plan"] = [
            "Warm-up (10 min)",
            "Strength training (moderate load)",
            "Low-impact cardio (20 min)",
            "Cooldown stretching"
        ]
        plan["notes"].append("Train with caution and proper form.")

    # Low risk
    if data.injury_risk == "LOW":
        plan["focus"] = "Performance Build"
        plan["intensity"] = "High"
        plan["workout_plan"] = [
            "Dynamic warm-up",
            "Strength training (high load)",
            "Endurance cardio (30 min)",
            "Cooldown & mobility"
        ]
        plan["notes"].append("You are cleared for high-intensity training.")

    # Adjust based on fatigue
    if data.fatigue_score >= 7:
        plan["intensity"] = "Reduced"
        plan["notes"].append("Fatigue is high. Reduce volume by 20%.")

    # Adjust based on recovery
    if data.recovery_score < 5:
        plan["notes"].append("Low recovery score. Prioritize sleep and hydration.")

    return plan
