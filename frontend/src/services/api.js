// src/services/api.js
export async function loginUser(credentials) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return await response.json();
}
