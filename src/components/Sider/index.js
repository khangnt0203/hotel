import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Menu, Layout } from "antd";
import { BankOutlined, SettingOutlined } from "@ant-design/icons";
import { getAuth } from "../../Util/httpHelper";
import { getHotel, setHotel } from "../../Util/Auth";

const { Sider } = Layout;
const { SubMenu } = Menu;



function SideBar(props) {

  const [hotel, setHotel] = useState();


  useEffect(() => {
    getHotelDetail();
  }, []);

  let chosen = getHotel();

  function getHotelDetail() {
    getAuth(`/hotels/${chosen}`).then((response) => {
      if (response.status === 200) {
        setHotel(response.data.data);
      }
    });
  }
  return (
    <Sider
      style={{
        backgroundColor: "white",
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
      width="250"
    >
      <Menu mode="inline" defaultOpenKeys="sub1,sub2,sub3,sub4">
        <h1
          style={{
            padding: 20,
            paddingBottom:50,
            paddingTop:40,
            fontStyle: "italic",
            fontSize: 30,
            color: "#33CCFF",
          }}
        >
          {hotel ? hotel.name : null}
        </h1>
        <h2 style={{ marginTop: 20, marginLeft: 40, fontSize: 15 }}>

        </h2>
        <Menu.Item onClick={() => props.onChoice("DASHBOARD")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: 7, color: "#7B68EE" }}
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-house-fill"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
            />
            <path
              fill-rule="evenodd"
              d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
            />
          </svg>
          Dashboard
        </Menu.Item>

        <SubMenu
          key="sub1"
          title="Booking Management"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: "#00FF7F" }}
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-cart-check-fill"
              viewBox="0 0 16 16"
            >
              <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1.646-7.646-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708z" />
            </svg>
          }
        >
          <Menu.Item onClick={() => props.onChoice("BOOKING")}>
            Booking
          </Menu.Item>
         
        </SubMenu>
      

        <SubMenu
          key="sub2"
          icon={<SettingOutlined style={{ color: "#7B68EE" }} />}
          title="Service Management">
          <Menu.Item onClick={() => props.onChoice("SERVICE DETAIL")}>
            Service
          </Menu.Item>
          <Menu.Item onClick={() => props.onChoice("SERVICE CATEGORY")}>
            Service Category
          </Menu.Item>
        </SubMenu>

        <SubMenu
          key="sub3"
          icon={<BankOutlined style={{ color: "#BA55D3" }} />}
          title="Hotel"
        >
          <Menu.Item onClick={() => props.onChoice("ROOM TYPE")}>
            Room Type
          </Menu.Item>
          <SubMenu title="Building" key="sub4" >
            <Menu.Item onClick={() => props.onChoice("ROOM")}>Room</Menu.Item>
            <Menu.Item onClick={() => props.onChoice("FLOOR")}>Floor</Menu.Item>
            <Menu.Item onClick={() => props.onChoice("BUILDING DETAIL")}>Block</Menu.Item>
          </SubMenu>
        </SubMenu>
      
      </Menu>
    </Sider>
  );
}

export default SideBar;
