def generate_suggestions(performance_score, injury_risk, fatigue_level):
    performance_score = int(performance_score)
    fatigue_level = int(fatigue_level)
    suggestions = []

    # Performance-based suggestions
    if performance_score < 40:
        suggestions.append("Performance index is low. Prioritize full recovery and sleep.")
    elif performance_score < 70:
        suggestions.append("Performance is moderate. Maintain consistent training load.")
    else:
        suggestions.append("Performance index is strong. Maintain structured progression.")

    # Injury risk suggestions
    if injury_risk == "High":
        suggestions.append("Elevated strain risk detected. Reduce training intensity and volume.")
    elif injury_risk == "Medium":
        suggestions.append("Moderate strain risk. Monitor joint stress and recovery closely.")
    else:
        suggestions.append("Low strain risk. Current workload is within safe tolerances.")

    # Fatigue trend suggestions
    if fatigue_level > 70:
        suggestions.append("Fatigue score is elevated. Schedule an active recovery session.")
    elif fatigue_level > 40:
        suggestions.append("Fatigue is manageable. Balance intensity with adequate rest.")
    else:
        suggestions.append("Fatigue levels are optimal. Readiness for training is high.")

    return suggestions
