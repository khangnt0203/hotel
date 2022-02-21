import Layout, { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import Headnav from "../Header";
import FormService from "../Service/FormService";
import ServiceCategoryTable from "../Service/ServiceCategory";
import ServiceTable from "../Service/ServiceDetail";
import Sidebar from "../Sider";

export default function Manager() {
  const [choice, setChoice] = useState("");
  function showRoute() {
    switch (choice) {
      case "SERVICE DETAIL":
        return <ServiceTable/>;
      case "ADD SERVICE":
        return <FormService />;
        case "SERVICE CATEGORY":
        return <ServiceCategoryTable />;
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
      <Sidebar onChoice={(e) => handleChoiceChange(e)}  />
      <Layout>
        <Headnav />
        <Content
          style={{ margin: "24px 16px 0", overflow: "initial" }}
        >
          {showRoute()}
        </Content>
      </Layout>
    </Layout>
  );
}
