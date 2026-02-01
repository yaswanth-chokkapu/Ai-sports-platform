def generate_suggestions(performance_score, injury_risk, fatigue_level):
    performance_score= int(performance_score)
    fatigue_level= int(fatigue_level)   
    suggestions = []

    # Performance-based suggestions
    if performance_score < 40:
        suggestions.append("Performance is low. Focus on recovery and sleep 💤")
    elif performance_score < 70:
        suggestions.append("Performance is moderate. Maintain consistency 💪")
    else:
        suggestions.append("Excellent performance. Keep it up 🔥")

    # Injury risk suggestions
    if injury_risk == "High":
        suggestions.append("High injury risk detected. Reduce training load 🚑")
    elif injury_risk == "Medium":
        suggestions.append("Moderate injury risk. Monitor fatigue closely ⚠️")
    else:
        suggestions.append("Low injury risk. You are training safely ✅")

    # Fatigue trend suggestions
    if fatigue_level > 70:
        suggestions.append("Fatigue is high. Schedule active recovery 🧘")
    elif fatigue_level > 40:
        suggestions.append("Fatigue is manageable. Balance intensity ⚖️")
    else:
        suggestions.append("Fatigue levels are optimal 🌱")

    return suggestions
