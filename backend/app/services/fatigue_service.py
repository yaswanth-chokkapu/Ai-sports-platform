fatigue_history = []

def update_fatigue(fatigue_score: int):
    fatigue_history.append(fatigue_score)

    if len(fatigue_history) > 7:
        fatigue_history.pop(0)

    average_fatigue = int(sum(fatigue_history) / len(fatigue_history))

    return {
        "history": fatigue_history,
        "average_fatigue": average_fatigue
    }

