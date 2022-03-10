import {
  MinusCircleOutlined,
  PlusOutlined,
  RightSquareOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Layout,
  Select,
  Space,
  Tabs,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { getHotel } from "../../Util/Auth";
import { getAuth } from "../../Util/httpHelper";

const { TabPane } = Tabs;

export default function Booking() {
  const [building, setBuilding] = useState([]);
  const [roomType, setRoomtype] = useState([]);
  function callback(key) {
    console.log(key);
  }

  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }
  const chosen = getHotel();

  function getBuilding() {
    getAuth(`/buildings?hotel-id=${chosen}`).then((response) => {
      let map = new Map();
      if (response.status === 200) {
        response.data.data.map((e) => {
          map.set(e.id, e);
        });
        setBuilding([...map.values()]);
      }
    });
  }
  useEffect(() => {
    getBuilding();
    getRoomtype();
  }, []);
  function getRoomtype() {
    getAuth(`/hotels/${chosen}/room-types`).then((response) => {
      let map = new Map();
      if (response.status === 200) {
        response.data.data.map((e) => {
          map.set(e.id, e);
        });
        setRoomtype([...map.values()]);
      }
    });
  }
  const addCustomer = () => {};
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const { Option } = Select;

  function handleChange(value) {
    console.log(`selected ${value}`);
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
            <div>
              <div>
                <hr color="#F2F2F2" />
                <br />
                <Tabs defaultActiveKey="1" onChange={callback}>
                  <TabPane tab="Booking" key="1">
                    
                      <Form
                        name="basic"
                        wrapperCol={{
                          span: 10,
                        }}
                        labelCol={{
                          span: 8,
                        }}
                        initialValues={{
                          remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                      >
                        <Form.Item
                          label="Guest name:"
                          name="guestName"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Guest Name!",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label="Phone number:"
                          name="phone"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Phone number!",
                            },
                          ]}
                        >
                          <Input type="number" />
                        </Form.Item>
                        <Form.List name="room">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map(({ key, name, ...restField }) => (
                                <Space key={key}>
                                  <Form.Item 
                                    {...restField}
                                    label="Room type:"
                                    name={[name, "roomType"]}
                                  >
                                    <Select
                                      defaultValue="lucy"
                                      style={{ width: 120, marginLeft: 30, marginRight: 20 }}
                                      onChange={handleChange}
                                    >
                                      <Option value="jack">Jack</Option>
                                      <Option value="lucy">Lucy</Option>
                                      <Option value="disabled" disabled>
                                        Disabled
                                      </Option>
                                      <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                  </Form.Item>
                                  <Form.Item
                                    {...restField}
                                    label="Quantity"
                                    name={[name, "quantity"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Missing quantity",
                                      },
                                    ]}
                                  >
                                    <InputNumber style={{marginLeft: 40}} placeholder="Quantity" />
                                  </Form.Item>
                                  <Form.Item
                                    {...restField}
                                    label="No. Adult"
                                    name={[name, "adult"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Missing Adult",
                                      },
                                    ]}
                                  >
                                    <InputNumber style={{marginLeft: 40}} placeholder="Adult" />
                                  </Form.Item>
                                  <Form.Item 
                                    {...restField}
                                    label="No. Child"
                                    name={[name, "child"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Missing Child",
                                      },
                                    ]}
                                  >
                                    <InputNumber style={{marginLeft: 40}} placeholder="Child" />
                                  </Form.Item>
                                  <MinusCircleOutlined
                                    onClick={() => remove(name)}
                                  />
                                </Space>
                              ))}
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  onClick={() => add()}
                                  block
                                  icon={<PlusOutlined />}
                                >
                                  Add Room
                                </Button>
                              </Form.Item>
                            </>
                          )}
                        </Form.List>
                        <Form.Item style={{ marginLeft: "70%" }}>
                          <Button type="primary" htmlType="submit">
                            Submit
                          </Button>
                        </Form.Item>
                      </Form>
                 
                  </TabPane>
                  <TabPane tab="Tab 2" key="2">
                    Content of Tab Pane 2
                  </TabPane>
                  <TabPane tab="Tab 3" key="3">
                    Content of Tab Pane 3
                  </TabPane>
                </Tabs>
                <br />
              </div>
            </div>
          </div>
        </Content>
      </Layout>
      {console.log(roomType)}
    </div>
  );
}
