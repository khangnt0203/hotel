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
import { delAuth, getAuth, postAuth, putAuth } from "../../Util/httpHelper";
import { getHotel } from "../../Util/Auth";

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
function Floor() {
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
  const [formAdd] = Form.useForm();
  const [floorList, setFloorList] = useState();
  const [floorNo, setFloorNo] = useState();
  const [totalRoom, setTotalRoom] = useState();
  const [building, setBuilding] = useState();
  const [keyBuilding, setKeyBuilding] = useState();
  const [selectedFloor, setSelectedFloor] = useState();
  const [floorId, setFloorId] = useState();
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
    getBuildingList();
    getFloorByBuilding(keyBuilding);
  }, []);

  useEffect(()=>{
    if(selectedFloor){
      formUpdate.setFieldsValue({
        floorNo: selectedFloor.floorNo,
        totalRoom: selectedFloor.totalRoom,
        building: selectedFloor.building
      })
    }
  },[selectedFloor])
  async function handleInputChange(e) {
    setKeyword(e.target.value);
  }
  const deleteFloor = (id) => {
    delAuth(`/floors/${id}`).then((response) => {
      if (response.status === 200) {
        message.success("Delete Successfully");
        getFloorByBuilding(building)
      }
      getFloorByBuilding(building)
    });
  };
  let chosen = getHotel();

  async function getFloorByBuilding(e) {
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

  async function loadBuilding(e) {
    await setBuilding(e);
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
  const column = [
    {
      title: "Floor",
      key: "nameService",
      dataIndex: "floorNo",
    },
    {
      title: "Total Room",
      key: "nameCatService",
      dataIndex: "totalRoom",
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
                setFloorId(item.id);
                setSelectedFloor(item);
                setIsModalUpdateVisible(true);
              }}
            >
              <EditFilled />
            </Button>
            <Popconfirm
              title="Are you sure to delete this Floor?"
              onConfirm={() => {
                deleteFloor(item.id);
              }}
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
  // add Floor
  const addFloor = () => {
    postAuth(`/floors`, {
      floorNo: floorNo,
      totalRoom: totalRoom,
      buildingId: building,
    }).then((response) => {
      if (response.status === 200) {
        message.success("Input Successfully");
        setIsModalVisible(false);
        getFloorByBuilding(building);
        formAdd.resetFields();
      }
      else{
        message.error("Error")
      }
    });
  };
 //edit floor
 const editFloor = (values) => {
   console.log('building', building)
  putAuth(`/floors`, {
   id: floorId,
   floorNo: values.floorNo,
   totalRoom: values.totalRoom,
   buildingId: building,
    status: true
  }).then((response) => {
    if (response.status === 200) {
      message.success("Update Successfully");
      setIsModalUpdateVisible(false);
      getFloorByBuilding(building);
    }
  });
};
  return (
    <div>
      <Modal
        title="Floor Form"
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
          <div>Floor</div>
          <Form.Item
            name="floorNo"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
          >
            <Input
              placeholder="Floor"
              name="floorNo"
              type="number"
              style={{
                height: 50,

                borderRadius: 6,
              }}
              onChange={(e) => setFloorNo(e.target.value)}
            />
          </Form.Item>
          <div>Total Room</div>
          <Form.Item
            name="TotalRoom"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Total Room"
              name="totalRoom"
              style={{
                height: 50,
                width: "100%",
                borderRadius: 6,
              }}
              onChange={(e) => setTotalRoom(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Building">
            <FormControl sx={{ width: 300 }}>
              <Select placeholder="Select Building..." onChange={loadBuilding}>
                {buildingList?.map((e) => (
                  <Option key={e.id} value={e.id}>
                    {e.buildingName}
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
              onClick={addFloor}
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
      </Modal>
      <>
        <Modal
          title="Service Category Update Form"
          visible={isModalUpdateVisible}
          onOk={() => {
            setIsModalUpdateVisible(false);
          }}
          onCancel={() => {
            setIsModalUpdateVisible(false);
          }}
          footer={false}
        >
          {selectedFloor ? (
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
            onFinish={editFloor}
          >
            <div>Floor</div>
            <Form.Item
              name="floorNo"
              rules={[
                {
                  required: true,
                  message: "This field is required!",
                },
              ]}
            >
              <Input
                placeholder="Floor"
                name="floorNo"
                type="number"
                style={{
                  height: 50,
  
                  borderRadius: 6,
                }}
                onChange={(e) => setFloorNo(e.target.value)}
              />
            </Form.Item>
            <div>Total Room</div>
            <Form.Item
              name="totalRoom"
              rules={[
                {
                  required: true,
                  message: "This field is required!",
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Total Room"
                name="totalRoom"
                style={{
                  height: 50,
                  width: "100%",
                  borderRadius: 6,
                }}
                onChange={(e) => setTotalRoom(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Building"  name='building'>
              <FormControl sx={{ width: 300 }}>
                <Select placeholder="Select Building..." onChange={loadBuilding} >
                  {buildingList?.map((e) => (
                    <Option key={e.id} value={e.id}>
                      {e.buildingName}
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
                  Floor Management
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
                  New Floor
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

                <Table columns={column} dataSource={floorList} />
              </div>
            </div>
          </div>
        </Content>
      </Layout>
      {console.log("building:", building)}
    </div>
  );
}
export default Floor;
