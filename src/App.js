import "./App.css";
import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import Login from "./components/Login";

import { BrowserRouter } from "react-router-dom";

import PrivateRoute from "./Util/PrivateRoute";
import Manager from "./components/Manager";
import PublicRoute from "./Util/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <PublicRoute exact path="/" component={Login} />
      <PrivateRoute exact path="/manager" component={Manager} />
    </BrowserRouter>
  );
}

export default App;
