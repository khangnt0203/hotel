import "./App.css";
import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import Login from "./components/Login";

import { BrowserRouter } from "react-router-dom";

import PrivateRoute from "./Util/PrivateRoute";
import Manager from "./components/Manager";
import PublicRoute from "./Util/PublicRoute";
import HomePage from "./components/HomePage";
import PrivateManagerRoute from "./Util/PrivateManagerRoute";
import OrderList from "./components/Booking/order-list";

function App() {
  return (
    <BrowserRouter>
      <PublicRoute exact path="/" component={Login} />

      <PrivateRoute exact path="/home" component={HomePage} />

      <PrivateManagerRoute exact path="/manager" component={Manager} />
        <PrivateManagerRoute exact path="/manager/order" component={OrderList} />
    </BrowserRouter>
  );
}

export default App;
