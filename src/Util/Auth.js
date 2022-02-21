export const getToken = () => {
  return sessionStorage.getItem("token");
};
export const setToken = (token) => {
  sessionStorage.setItem("token", token);
};
export const setUser = (user) => {
  sessionStorage.setItem("user", user);
};
export const getUser = () => {
  return sessionStorage.getItem("user");
};
export const isLogin = () => {
  if (getToken() === null) {
    return false;
  } else return true;
};

export const removeToken = () => {
  sessionStorage.removeItem("token");
};
