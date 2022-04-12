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
export const setUserJWT = (user) => {
  sessionStorage.setItem("userJWT", JSON.stringify(user));
};
export const getUserJWT = () => {
  return sessionStorage.getItem("userJWT");
};
export const isLogin = () => {
  if (getToken() === null) {
    return false;
  } else return true;
};

export const removeToken = () => {
  sessionStorage.removeItem("token");
};

export const setHotel = (hotel) => {
  sessionStorage.setItem("hotel", hotel);
};

export const getHotel = () => {
  return sessionStorage.getItem("hotel");
};

export const isChooseHotel = () => {
  if (getHotel() === null) {
    return false;
  } else return true;
};

export const setBookingId = (BookingId) => {
  sessionStorage.setItem("BookingId", BookingId);
};

export const getBookingId = () => {
  return sessionStorage.getItem("BookingId");
};

export const isChooseBookingId = () => {
  if (getBookingId() === null) {
    return false;
  } else return true;
};
