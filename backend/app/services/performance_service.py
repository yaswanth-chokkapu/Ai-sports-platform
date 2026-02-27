def analyze_performance(data):
    strength = int((data.training_load + data.heart_rate) / 2)
    endurance = int((data.session_duration + data.sleep_hours * 10) / 2)
    recovery = data.recovery_score
    fatigue = data.fatigue_score

    overall = int(
        strength * 0.25 +
        endurance * 0.25 +
        recovery * 0.3 +
        (100 - fatigue) * 0.2
    )

    return {
        "overall_score": overall,
        "metrics": {
            "strength": strength,
            "endurance": endurance,
            "recovery": recovery,
            "fatigue": fatigue
        }
    }

