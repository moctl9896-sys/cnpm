import { login } from "../api/auth";
import { getRole } from "../auth/userStore";

//redirect theo role
const redirectByRole = (role) => {
  switch (role) {
    case "admin":
      window.location.href = "/admin/dashboard";
      break;
    case "recruiter":
      window.location.href = "/recruiter/dashboard";
      break;
    case "candidate":
      window.location.href = "/candidate/dashboard";
      break;
    default:
      window.location.href = "/login";
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  await login(email, password);

  const role = getRole();
  redirectByRole(role);
};
