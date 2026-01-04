//luu role
const ROLE_KEY = "user_role";

export const setRole = (role) => {
  localStorage.setItem(ROLE_KEY, role);
};

export const getRole = () => {
  return localStorage.getItem(ROLE_KEY);
};

export const clearRole = () => {
  localStorage.removeItem(ROLE_KEY);
};
