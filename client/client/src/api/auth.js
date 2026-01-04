import { setRole } from "../auth/userStore";

//luu role
export async function login(email, password) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  const data = await res.json();
  setRole(data.role);
}
