def generate_coach_feedback(data):
    messages = []

    if data.sleep_hours < 5:
        messages.append("You didn’t get enough sleep. Prioritize rest tonight.")

    if data.fatigue_score > 70:
        messages.append("High fatigue detected. Consider reducing training intensity.")

    if data.recovery_score > 70:
        messages.append("Your recovery looks good. You’re adapting well.")

    if data.previous_injury:
        messages.append("Since you had a previous injury, focus on warm-ups and mobility.")

    if not messages:
        messages.append("Great session! Keep training consistently and listen to your body.")

    return " ".join(messages)
