const BASE_URL = "http://127.0.0.1:8000";

export async function checkPerformance(data) {
  const res = await fetch(`${BASE_URL}/performance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function predictInjury(data) {
  const res = await fetch(`${BASE_URL}/prediction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getTrainingPlan(data) {
  const res = await fetch(`${BASE_URL}/training`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
