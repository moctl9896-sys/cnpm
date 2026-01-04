import { clearRole } from "./userStore";

export function logout() {
  clearRole();
  window.location.href = "/login";
}