import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Breadcrumb,
  Layout,
  Modal,
  Select,
  Form,
  message,
  Table,
  Popconfirm,
  InputNumber,
  Space,
} from "antd";
import "antd/dist/antd.css";
import "../Floor/style.css";

import FormControl from "@mui/material/FormControl";

import {
  DeleteFilled,
  EditFilled,
  MinusCircleOutlined,
  PlusOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { putAuth, getAuth, postAuth } from "../../Util/httpHelper";
import { getBuilding, getHotel } from "../../Util/Auth";

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function onChange(pagination, filters, sorter, extra) {
  console.log("params", pagination, filters, sorter, extra);
}
function Room() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [cateList, setCateList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [keyword, setKeyword] = useState([]);
  const [keyCate, setKeyCate] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceName, setServiceName] = useState();
  const [buildingList, setBuildingList] = useState();
  const [price, setPrice] = useState();
  const [building, setBuilding] = useState();
  const [floor, setFloor] = useState();
  const [floorNo, setFloorNo] = useState();
  const [totalRoom, setTotalRoom] = useState();
  const [roomNo, setRoomNo] = useState();
  const [maxCapacity, setMaxCapacity] = useState();
  const [roomTypeList, setRoomTypeList] = useState();
  const [formAdd] = Form.useForm();
  const [floorList, setFloorList] = useState();
  const [roomList, setRoomList] = useState();
  const [keyBuilding, setKeyBuilding] = useState();
  const [keyFloor, setKeyFloor] = useState();
  const [roomType, setRoomType] = useState();
  const [selectedRoom, setSelectedRoom] = useState();
  const [roomId, setRoomId] = useState();
  const [formUpdate] = Form.useForm();
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsModalUpdateVisible(false);
  };

  function handleInputChange(e) {
    setKeyword(e.target.value);
  }

  useEffect(() => {
    getFloorList();
    getRoomByFloor(keyFloor);
    getBuildingList();
    getFloorByBuilding(keyBuilding);
    getRoomType();
  }, []);

  let chosen = getHotel();

  async function getRoomByFloor(e) {
    console.log(roomList);
    let map = new Map();
    getAuth(`/rooms?floor-id=${e}`).then((response) => {
      if (response.status === 200) {
        response.data.data.data.map((p) => {
          map.set(p.id, p);
        });
        setRoomList([...map.values()]);
      }
    });
  }

  async function loadFloor(e) {
    await setFloor(e);
    console.log("floor:", floor);
  }
  async function loadBuilding(e) {
    await setBuilding(e);
  }
  async function loadRoomType(e) {
    await setRoomType(e);
    console.log("room type:", roomType);
  }

  async function getFloorByBuilding(e) {
    console.log("id:", e);
    let map = new Map();
    getAuth(`/floors?building-id=${e}`).then((response) => {
      if (response.status === 200) {
        response.data.data.map((p) => {
          map.set(p.id, p);
        });
        setFloorList([...map.values()]);
      }
    });
  }

  function getBuildingList() {
    let map = new Map();
    getAuth(`/buildings?hotel-id=${chosen}`).then((response) => {
      if (response.status === 200) {
        response.data.data.map((e) => {
          map.set(e.id, e);
        });
        setBuildingList([...map.values()]);
      }
    });
  }
  function getFloorList() {
    let map = new Map();
    getAuth(`/floors?building-id=${building}`).then((response) => {
      if (response.status === 200) {
        response.data.data.map((e) => {
          map.set(e.id, e);
        });
        setFloorList([...map.values()]);
      }
    });
  }

  function getRoomType() {
    let map = new Map();
    getAuth(`/room-types?hotel-id=${chosen}`).then((response) => {
      if (response.status === 200) {
        response.data.data.data.map((e) => {
          map.set(e.id, e);
        });
        setRoomTypeList([...map.values()]);
      }
    });
  }
  const column = [
    {
      title: "Room No",
      key: "roomNo",
      dataIndex: "roomNo",
    },
    {
      title: "Max Capacity",
      key: "roomNo",
      dataIndex: "maxCapacity",
    },
    {
      title: "Action",
      render: (e, item) => {
        return (
          <>
            <Button
              type="primary"
              style={{
                borderRadius: 3,
                marginLeft: 10,
                height: 45,
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#11cdef",
                borderColor: "#11cdef",
              }}
              onClick={() => {
                setRoomId(item.id);
                setSelectedRoom(item);
                setIsModalUpdateVisible(true);
              }}
            >
              <EditFilled />
            </Button>
            <Popconfirm
              title="Are you sure to delete this Room?"
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="danger"
                style={{
                  borderRadius: 3,
                  height: 45,
                  marginLeft: 10,
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#f5365c",
                }}
              >
                <DeleteFilled />
              </Button>
            </Popconfirm>
            ,
          </>
        );
      },
    },
  ];
  // add service
  const addRoom = () => {
    console.log("room no:", roomNo);
    console.log("max capacity:", maxCapacity);
    console.log("floor:", floor);
    console.log("roomtype:", roomType);
    postAuth(`/rooms`, {
      roomNo: roomNo,
      maxCapacity: maxCapacity,
      floorId: floor,
      roomTypeId: roomType,
    }).then((response) => {
      if (response.status === 200) {
        message.success("Input Successfully");
        setIsModalVisible(false);
        getRoomByFloor(floor);
        formAdd.resetFields();
      }
    });
  };
useEffect(()=>{
  if(selectedRoom){
    formUpdate.setFieldsValue({
      roomNo: selectedRoom.roomNo,
      maxCapacity: selectedRoom.maxCapacity,
      floorId: selectedRoom.floor,
      roomTypeId: selectedRoom.roomType
    })
  }
},[selectedRoom])
const editRoom = (values) => {
  putAuth(`/rooms`, {
    id: roomId,
    roomNo: values.roomNo,
    floorId: floor,
    maxCapacity: values.maxCapacity,
    roomTypeId: roomType,
    status: true
  }).then((response) => {
    if (response.status === 200) {
      message.success("Update Successfully");
      setIsModalUpdateVisible(false);
      getRoomByFloor(floor);
    }
  });
};
  return (
    <div>
      <Modal
        title="Room Form"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          name="basic"
          form={formAdd}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 40,
          }}
          autoComplete="off"
        >
          <Form.Item label="Building">
            <FormControl sx={{ width: 300 }}>
              <Select
                placeholder="Select Building..."
                onChange={getFloorByBuilding}
              >
                {buildingList?.map((e) => (
                  <Option key={e.id} value={e.id}>
                    {e.buildingName}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Form.Item>
          <Form.Item label="Floor">
            <FormControl sx={{ width: 300 }}>
              <Select placeholder="Select Floor..." onChange={loadFloor}>
                {floorList?.map((e) => (
                  <Option key={e.id} value={e.id}>
                    {e.floorNo}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Form.Item>
          <div>Room No </div>
          <Form.Item
            name="roomNo"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
          >
            <Input
              placeholder="Room No"
              name="roomNo"
              style={{
                height: 50,

                borderRadius: 6,
              }}
              onChange={(e) => setRoomNo(e.target.value)}
            />
          </Form.Item>
          <div>Max Capacity</div>
          <Form.Item
            name="maxCapacity"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Max Capacity"
              name="maxCapacity"
              style={{
                height: 50,
                width: "100%",
                borderRadius: 6,
              }}
              onChange={(e) => setMaxCapacity(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Room Type">
            <FormControl sx={{ width: 300 }}>
              <Select placeholder="Select Room Type..." onChange={loadRoomType}>
                {roomTypeList?.map((e) => (
                  <Option key={e.id} value={e.id}>
                    {e.name}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
          ></Form.Item>
          <Form.Item
            style={{ marginLeft: 150 }}
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
          >
            <Button
              key="back"
              onClick={handleCancel}
              style={{
                height: 35,
                width: 100,
                borderRadius: 6,
              }}
            >
              Return
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                borderColor: "#0000AA",
                marginLeft: 10,
                height: 35,
                width: 100,
                borderRadius: 6,
                backgroundColor: "#0000AA",
                boxShadow:
                  "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
              }}
              onClick={addRoom}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <>
        <Modal
          title="Service Update Form"
          visible={isModalUpdateVisible}
          onOk={() => {
            setIsModalUpdateVisible(false);
          }}
          onCancel={() => {
            setIsModalUpdateVisible(false);
          }}
          footer={false}
        >
          {selectedRoom ? (
            <Form
              name="basic"
              form={formUpdate}
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 40,
              }}
              autoComplete="off"
              onFinish={editRoom}
            >
              <Form.Item label="Building">
                <FormControl sx={{ width: 300 }}>
                  <Select
                    placeholder="Select Building..."
                    onChange={getFloorByBuilding}
                  >
                    {buildingList?.map((e) => (
                      <Option key={e.id} value={e.id}>
                        {e.buildingName}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </Form.Item>
              <Form.Item label="Floor">
                <FormControl sx={{ width: 300 }}>
                  <Select placeholder="Select Floor..." onChange={loadFloor}>
                    {floorList?.map((e) => (
                      <Option key={e.id} value={e.id}>
                        {e.floorNo}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </Form.Item>
              <div>Room No </div>
              <Form.Item
                name="roomNo"
                rules={[
                  {
                    required: true,
                    message: "This field is required!",
                  },
                ]}
              >
                <Input
                  placeholder="Room No"
                  name="roomNo"
                  style={{
                    height: 50,

                    borderRadius: 6,
                  }}
                  onChange={(e) => setRoomNo(e.target.value)}
                />
              </Form.Item>
              <div>Max Capacity</div>
              <Form.Item
                name="maxCapacity"
                rules={[
                  {
                    required: true,
                    message: "This field is required!",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Max Capacity"
                  name="maxCapacity"
                  style={{
                    height: 50,
                    width: "100%",
                    borderRadius: 6,
                  }}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Room Type">
                <FormControl sx={{ width: 300 }}>
                  <Select
                    placeholder="Select Room Type..."
                    onChange={loadRoomType}
                  >
                    {roomTypeList?.map((e) => (
                      <Option key={e.id} value={e.id}>
                        {e.name}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 6,
                  span: 16,
                }}
              ></Form.Item>
              <Form.Item
                style={{ marginLeft: 150 }}
                wrapperCol={{
                  offset: 6,
                  span: 16,
                }}
              >
                <Button
                  key="back"
                  onClick={handleCancel}
                  style={{
                    height: 35,
                    width: 100,
                    borderRadius: 6,
                  }}
                >
                  Return
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    borderColor: "#0000AA",
                    marginLeft: 10,
                    height: 35,
                    width: 100,
                    borderRadius: 6,
                    backgroundColor: "#0000AA",
                    boxShadow:
                      "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
                  }}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          ) : null}
        </Modal>
      </>
      <Layout className="site-layout">
        <Content
          style={{
            margin: "0 16px",
            boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)",
            borderRadius: 10,
          }}
        >
          <Breadcrumb
            style={{
              fontWeight: 600,
              fontStyle: "inherit",
              color: "white",
              fontSize: 17,
              marginLeft: 70,
              top: -220,
              position: "relative",
            }}
          >
            <Breadcrumb.Item style={{ fontSize: 22 }}>Hotel </Breadcrumb.Item>
            <Breadcrumb.Item>Building</Breadcrumb.Item>
            <Breadcrumb.Item>Floor</Breadcrumb.Item>
            <Breadcrumb.Item>Room</Breadcrumb.Item>
          </Breadcrumb>

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
              <div style={{}}>
                <div
                  style={{
                    padding: 10,
                    fontStyle: "inherit",
                    fontSize: 50,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: "#32325d",
                  }}
                >
                  Room Management
                </div>

                <Button
                  style={{
                    borderColor: "#f7fafc",
                    marginBottom: 30,
                    marginLeft: "80%",
                    height: 45,
                    width: 150,
                    borderRadius: 6,
                    backgroundColor: "#f7fafc",
                    boxShadow:
                      "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
                  }}
                  onClick={showModal}
                >
                  <PlusSquareOutlined />
                  New Room
                </Button>
                <hr color="#F2F2F2" />
                <br />

                <FormControl sx={{ m: 1, width: 300 }}>
                  <Select
                    placeholder="Select Building..."
                    onChange={getFloorByBuilding}
                  >
                    {buildingList?.map((e) => (
                      <Option key={e.id} value={e.id}>
                        {e.buildingName}
                      </Option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ m: 1, width: 300 }}>
                  <Select
                    placeholder="Select Floor..."
                    onChange={getRoomByFloor}
                  >
                    {floorList?.map((e) => (
                      <Option key={e.id} value={e.id}>
                        {e.floorNo}
                      </Option>
                    ))}
                  </Select>
                </FormControl>

                <Table columns={column} dataSource={roomList} />
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
}
export default Room;
