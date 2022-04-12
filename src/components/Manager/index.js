import Layout, { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { getHotel } from "../../Util/Auth";
import Dashboard from "../Dashboard";
import Booking from "../Booking";
import Headnav from "../Header";
import FormService from "../Service/FormService";
import ServiceCategoryTable from "../Service/ServiceCategory";
import ServiceTable from "../Service/ServiceDetail";
import Sidebar from "../Sider";
import BuildingTable from "../Building/BuildingTable";
import RoomType from "../RoomType"
import ListBooking from "../Booking/booking-list";
import OrderList from "../Booking/order-list";
import Floor from "../Floor";
import Room from "../Room";

export default function Manager() {
  const [choice, setChoice] = useState("");
  function showRoute() {
    switch (choice) {
      case "SERVICE DETAIL":
        return <ServiceTable />;
      case "ADD SERVICE":
        return <FormService />;
      case "SERVICE CATEGORY":
        return <ServiceCategoryTable />;
      case "DASHBOARD":
        return <Dashboard />;
      case "BOOKING":
        return <ListBooking />;
      case "ORDERLIST":
        return <OrderList />;
      case "BUILDING DETAIL":
        return <BuildingTable />;
      case "ROOM TYPE":
        return <RoomType />;
        case "ROOM":
        return <Room/>;
      case "FLOOR":
        return <Floor />;
      default:
        return <Dashboard />;
    }
  }
  function handleChoiceChange(e) {
    console.log(e);
    setChoice(e);
  }
  useEffect(() => {}, [choice]);

  return (
    <Layout
      style={{ minHeight: "100vh", marginLeft: 200, overflow: "hidden" }}
      className="site-layout"
    >
      {console.log("hotel:", getHotel())}
      <Sidebar onChoice={(e) => handleChoiceChange(e)} />
      <Layout>
        <Headnav />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          {showRoute()}
        </Content>
      </Layout>
    </Layout>
  );
}
