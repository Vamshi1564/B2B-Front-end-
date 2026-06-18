export const login = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("logout"));
};

export const getUser = () => {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("user");
};