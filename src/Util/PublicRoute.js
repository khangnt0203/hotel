import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLogin } from "./Auth";


const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    
    <Route
      {...rest}
      
      render={(props) =>{
        if(isLogin() === false){
          return <Component {...props}/>
        }
        else{
          return <Redirect to={'/manager'}/>
        }
      }
      }
    />
  );
};

export default PublicRoute;