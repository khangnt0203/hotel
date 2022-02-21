import React from "react";

import "antd/dist/antd.css";
import "../Header/Header.css";
import { Layout } from "antd";

import HeadBanner from "./HeadBanner";

const { Header } = Layout;

function Headnav() {
  return (
    <Layout className="site-layout">
      <Header style={{ padding: 115, backgroundColor: "#33CCFF" }}>
        <HeadBanner />
      </Header>
    </Layout>
  );
}

export default Headnav;
