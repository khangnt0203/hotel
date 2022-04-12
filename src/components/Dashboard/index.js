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
  const [report, setReport] = useState();
  const handleShow = () => {
    setIsVisible(true);
  };
  const handleClose = () => {
    setIsVisible(false);
  };
  useEffect(() => {
    getHotelDetail();
    getReport();
  }, []);

  let chosen = getHotel();

  function getHotelDetail() {
    getAuth(`/hotels/${chosen}`).then((response) => {
      if (response.status === 200) {
        setHotel(response.data.data);
      }
    });
  }

  function toTimestamp(){return Date.now()/1000;}

  function getReport() {
    console.log(`/reports/${chosen}/?date-pick=${toTimestamp().toFixed(0)}`);
    
    getAuth(`/reports/${chosen}/?date-pick=${toTimestamp().toFixed(0)}`).then((response) => {
      if (response.status === 200) {
        setReport(response.data.data);
        console.log(report);
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
                 {/* {hotel? <Card bordered={false}>
                    <img
                      style={{ witdh: 200, height: 200 }}
                      src='https://pearlriverhotel.vn/wp-content/uploads/2019/07/pearl-river-hotel-home1.jpg'
                      alt='Image is not available'
                    />
                  </Card>:null} */}
                  {/* booking info */}
                  <Card bordered={false}>
                    Booking State
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card>
                          <Statistic
                            title="New"
                            value={report ? report.newOrder : 0}
                            precision={0}
                            valueStyle={{ color: "#345beb" }}
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card>
                          <Statistic
                            title="Check In"
                            value={report ? report.checkInOrder : 0}
                            precision={0}
                            valueStyle={{ color: "#ebba34" }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                  <Card bordered={false}>
                    {/* Booking */}
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card>
                          <Statistic
                            title="Staying"
                            value={report ? report.stayInOrder : 0}
                            precision={0}
                            valueStyle={{ color: "#2cd15d" }}
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card>
                          <Statistic
                            title="Check Out"
                            value={report ? report.checkOutOrder : 0}
                            precision={0}
                            valueStyle={{ color: "#d13f2c" }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                  {/* revenue info */}
                  <Card bordered={false}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card>
                          <Statistic
                            title="Cancel"
                            value={report ? report.cancelOrder : 0}
                            precision={0}
                            valueStyle={{ color: "#8f8e8d" }}
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card>
                          <Statistic
                            title="Revenue"
                            value={report ? report.revenue : 0}
                            precision={0}
                            valueStyle={{ color: "#dc5ce6" }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                {/* hotel info */}
                
                <Col span={15}>
                  {hotel ? (
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
                  ) : null}
                  <Card bordered={false}>
                    Room State
                    <Row gutter={16}>
                      <Col span={8}>
                        <Card>
                          <Statistic
                            title="Vacancies"
                            value={report ? report.vacancies : 0}
                            precision={0}
                            valueStyle={{ color: "#2cd15d" }}
                          />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card>
                          <Statistic
                            title="Fullness"
                            value={report ? report.fullness : 0}
                            precision={0}
                            valueStyle={{ color: "#5ce6e3" }}
                          />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card>
                          <Statistic
                            title="Departure"
                            value={report ? report.departure : 0}
                            precision={0}
                            valueStyle={{ color: "#cf1322" }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
}
