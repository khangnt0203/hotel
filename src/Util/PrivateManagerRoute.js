import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isChooseHotel, isLogin } from "./Auth";

const PrivateManagerRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if ((isLogin() === true) & (isChooseHotel() === true)) {
          return <Component {...props} />;
        } else {
          return <Redirect to={"/home"} />;
        }
      }}
    />
  );
};

export default PrivateManagerRoute;
