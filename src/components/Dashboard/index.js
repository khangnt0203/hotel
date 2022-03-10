import React, { useEffect, useState } from "react";
import {
  Layout,
  Rate,
  Descriptions,
  Button,
  Card,
  Col,
  Row,
  Statistic,
} from "antd";
import "antd/dist/antd.css";
import "../Dashboard/style.css";
import { getAuth } from "../../Util/httpHelper";
import { getHotel } from "../../Util/Auth";

const { Content } = Layout;

export default function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState();
  const [hotel, setHotel] = useState();
  const handleShow = () => {
    setIsVisible(true);
  };
  const handleClose = () => {
    setIsVisible(false);
  };
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
    <div>
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
            }}
          >
            <div className="site-card-wrapper">
              <Row gutter={20}>
                {/* hotel activity */}
                <Col span={8}>
                  {/* image */}
                 {hotel? <Card bordered={false}>
                    <img
                      style={{ witdh: 200, height: 200 }}
                      src='https://pearlriverhotel.vn/wp-content/uploads/2019/07/pearl-river-hotel-home1.jpg'
                      alt='Image is not available'
                    />
                  </Card>:null}
                  {/* booking info */}
                  <Card bordered={false}>
                    Booking
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card>
                          <Statistic
                            title="Success"
                            value={11.28}
                            precision={2}
                            valueStyle={{ color: "#3f8600" }}
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card>
                          <Statistic
                            title="Fail"
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: "#cf1322" }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                  {/* revenue info */}
                  <Card bordered={false}>
                    Revenue
                    <Row gutter={16}>
                      <Col span={12}>
                        <Statistic title="Active Users" value={112893} />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Account Balance (CNY)"
                          value={112893}
                          precision={2}
                        />
                        <Button style={{ marginTop: 16 }} type="primary">
                          Recharge
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                {/* hotel info */}
                {hotel ? (
                  <Col span={15}>
                    <Card bordered={false}>
                      <Descriptions title="Hotel Info" bordered>
                        <Descriptions.Item label="Name" span={3}>
                          {hotel.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Address" span={3}>
                         {hotel.address}
                        </Descriptions.Item>
                        <Descriptions.Item label="Latitude" span={1.5}>
                          {hotel.latitude}
                        </Descriptions.Item>
                        <Descriptions.Item label="Longitude" span={1.5}>
                         {hotel.longtitude}
                        </Descriptions.Item>

                        <Descriptions.Item label="Description">
                        {hotel.description}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                ) : null}
              </Row>
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
}
