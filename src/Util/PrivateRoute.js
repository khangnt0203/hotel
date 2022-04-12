import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isChooseHotel, isLogin } from "./Auth";


const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}

      render={(props) =>{
        if(isLogin() === true ){
          return <Component {...props}/>
        }
        else{
          return <Redirect to={'/'}/>
        }
      }
      }
    />
  );
};

export default PrivateRoute;
