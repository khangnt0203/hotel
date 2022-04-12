import React, { useEffect, useState } from "react";
import { Layout, Card, Rate, Drawer, Descriptions } from "antd";
import { useHistory } from "react-router-dom";
import "antd/dist/antd.css";
import "../Dashboard/style.css";
import { getAuth } from "../../Util/httpHelper";
import Headnav from "../Header";
import "../HomePage/style.css";

import { EditOutlined, SettingOutlined, CheckOutlined } from "@ant-design/icons";
import { getUserJWT, setHotel } from "../../Util/Auth";

const { Meta } = Card;
const { Content } = Layout;

export default function Dashboard() {
  const [hotelList, setHotelList] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState();
  const history = useHistory();
  const handleShow = () => {
    setIsVisible(true);
  };
  const handleClose = () => {
    setIsVisible(false);
  };
  useEffect(() => {
    getHotel();
  }, []);

  var user = JSON.parse(getUserJWT());

  function getHotel() {
    getAuth(`/hotels?user-id=${user.id}`).then((respone) => {
      let map = new Map();
      if (respone.status === 200) {
        respone.data.data.data.map((e) => {
          map.set(e.id, e);
        });
        setHotelList([...map.values()]);
      }
    });
  }

  const setting = (e) => {
    setHotel(e.id);
    history.push('/manager')
  };


  const gridStyle = {
    width: "25%",
    marginLeft: "6%",
    marginTop: "2%",
    textAlign: "center",
    borderRadius:5
  };
 
  return (
    <div>
      <Layout
        style={{ minHeight: "100vh", overflow: "hidden" }}
        className="site-layout"
      >
        <Layout>
          <Headnav />
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            <Layout className="site-layout">
              <Content
                style={{
                  margin: "0 16px",
                  boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)",
                  borderRadius: 10,
                }}
              >
                <div
                  className="site-layout-background"
                  style={{
                    padding: 24,
                    marginTop: -200,
                    borderRadius: 6,
                    marginLeft: 50,
                    borderRadius:5
                  }}
                >
                  <Card title="Choose Hotel" style={{ borderRadius:5}}>
                    {hotelList.map((e) => (
                      <Card.Grid style={gridStyle} key={e.id} >
                        <Card
                          style={{ width: 300, borderRadius:10 }}
                          cover={
                            <img alt="Image is not available" src={e.image} />
                          }
                          key={e}
                          actions={[
                            <SettingOutlined
                              key="setting"
                              onClick={() => {
                                setSelectedHotel(e);
                                handleShow();
                              }}
                            />,
                            <EditOutlined  key="edit" onClick={()=>{
                              setSelectedHotel(e);
                              setting(e);
                            }} />,
                          ]}
                        >
                          <Meta
                            title={e.name}
                            description={e.description}
                          />
                          <Rate disabled value={e.stars}/>
                        </Card>
                      </Card.Grid>
                    ))}
                  </Card>
                </div>
              </Content>
            </Layout>

            <Drawer width={900} visible={isVisible} onClose={handleClose}>
              {selectedHotel ? (
                <Descriptions title="Hotel Info" bordered>
                  <Descriptions.Item label="Hotel Name">
                    {selectedHotel.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Image">
                    <img src={selectedHotel.image} alt="No Image Available" />
                  </Descriptions.Item>
                  <Descriptions.Item label="Rate">
                    <Rate disabled allowHalf value={selectedHotel.stars} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Description">
                    {selectedHotel.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="Latitude">
                    {selectedHotel.latitude}
                  </Descriptions.Item>
                  <Descriptions.Item label="Longitude">
                    {selectedHotel.longitude}
                  </Descriptions.Item>
                  <Descriptions.Item label="Checkin time">
                    {selectedHotel.checkinTime}
                  </Descriptions.Item>
                  <Descriptions.Item label="Checkout Time" span={2}>
                    {selectedHotel.checkoutTime}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {selectedHotel.address}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <a>hihi lỗi rùi</a>
              )}
            </Drawer>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
