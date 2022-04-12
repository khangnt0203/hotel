import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Breadcrumb,
  Layout,
  Modal,
  Form,
  message,
  Table,
  Popconfirm,
  Drawer,
} from "antd";
import "antd/dist/antd.css";
import {
  PlusSquareOutlined,
  DeleteFilled,
  EditFilled,
} from "@ant-design/icons";
import { delAuth, getAuth, postAuth, putAuth } from "../../Util/httpHelper";
import { getHotel } from "../../Util/Auth";
const { Content } = Layout;
const { Search } = Input;

function BuildingTable() {
  const [buildingList, setBuildingList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [buildingName, setBuildingName] = useState("");
  const [totalRoom, setTotalRoom] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBuilding, setSelectedBuilding] = useState();
  const [buildingId, setBuildingId]=useState();
  const [formUpdate]=Form.useForm();
  const [formAdd] = Form.useForm();
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

  const showModalUpdate = () => {

    setIsModalUpdateVisible(true);
  };

  useEffect(() => {
    getListBuilding(currentPage);
  }, []);

  // update form update when selectedCAtegory change
  let chosen = getHotel();

  async function getListBuilding(page) {
    getAuth(`/buildings?hotel-id=${chosen}&page-index=${page}`).then(
      (response) => {
        let map = new Map();
        if (response.status === 200) {
          response.data.data.map((e) => {
            map.set(e.id, e);
          });
          setBuildingList([...map.values()]);
        }
      }
    );
  }
  const deleteBuilding = (id) => {
    delAuth(`/buildings/${id}`).then((response) => {
      if (response.status === 200) {
        message.success("Delete Successfully");
        getListBuilding(currentPage);
      }
    });
  };
  const addBuilding = () => {
    postAuth(`/buildings`, {
      buildingName: buildingName,
      totalRoom: totalRoom,
      hotelId: chosen,
    }).then((response) => {
      if (response.status === 200) {
        message.success("Input Successfully");
        setIsModalVisible(false);
        getListBuilding(currentPage);
        formAdd.resetFields();
      }
    });
  };
  useEffect(() => {
    getBuilding();
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      formUpdate.setFieldsValue({
      buildingName: selectedBuilding.buildingName,
      totalRoom: selectedBuilding.totalRoom
      });
    }
  }, [selectedBuilding]);

  const editBuilding = (values) => {
    putAuth(`/buildings`, {
      id: buildingId,
      buildingName: values.buildingName,
      totalRoom: values.totalRoom,
      hotelId: chosen,
      status: true
    }).then((response) => {
      if (response.status === 200) {
        message.success("Update Successfully");
        setIsModalUpdateVisible(false);
        getListBuilding(currentPage);
      }
    });
  };
  function getBuilding() {
    getAuth(`/buildings?hotel-id=${chosen}`).then((response) => {
      if (response.status === 200) {
        let map = new Map();
        response.data.data.map((e) => {
          map.set(e.id, e);
        });
        setBuildingList([...map.values()]);
      }
    });
  }

  function getListBuildingBySearch() {
    getAuth(`/buildings?building-name=${keyword}&hotel-id=2`).then(
      (response) => {
        if (response.status === 200) {
          setBuildingList([...response.data.data]);
        }
      }
    );
  }

  const column = [
    {
      title: "No",
      key: "id",
      render: (e, item, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: "Building name",
      key: "id",
      dataIndex: "buildingName",
    },
    {
      title: "Total Room",
      key: "id",
      dataIndex: "totalRoom",
    },

    {
      title: "Action",
      render: (e, item) => {
        return (
          <>
            <Button
               onClick={() => {
                setBuildingId(item.id);
                setSelectedBuilding(item);
                setIsModalUpdateVisible(true);
              }}
              type="primary"
              style={{
                borderRadius: 3,
                marginLeft: 10,
                height: 45,
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#11cdef",
                borderColor: "#11cdef",
              }}
            >
              <EditFilled />
            </Button>
            <Popconfirm
              title="Are you sure to delete this Building?"
              onConfirm={() => {
                deleteBuilding(item.id);
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
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <Modal
        title="Room Add Form"
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
          <div>Name Building</div>
          <Form.Item
            name="buildingName"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
          >
            <Input
              placeholder="Building name"
              name="buildingName"
              style={{
                height: 50,

                borderRadius: 6,
              }}
              onChange={(e)=>setBuildingName(e.target.value)}
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
              onChange={(e)=>setTotalRoom(e.target.value)}
            />
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
              onClick={addBuilding}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <>
        <Modal
          title="Building Update Form"
          visible={isModalUpdateVisible}
          onOk={() => {
            setIsModalUpdateVisible(false);
          }}
          onCancel={() => {
            setIsModalUpdateVisible(false);
          }}
          footer={false}
        >
          {selectedBuilding ? (
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
             onFinish={editBuilding}
           >
             <div>Name Building</div>
             <Form.Item
               name="buildingName"
               rules={[
                 {
                   required: true,
                   message: "This field is required!",
                 },
               ]}
             >
               <Input
                 placeholder="Building name"
                 name="buildingName"
                 style={{
                   height: 50,
   
                   borderRadius: 6,
                 }}
                 onChange={(e)=>setBuildingName(e.target.value)}
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
                 onChange={(e)=>setTotalRoom(e.target.value)}
               />
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
            <Breadcrumb.Item style={{ fontSize: 22 }}>
              Building Management
            </Breadcrumb.Item>
            <Breadcrumb.Item>Building</Breadcrumb.Item>
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
                  Building Management
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
                  New Building
                </Button>
                <hr color="#F2F2F2" />
                <br />
                <Search
                  placeholder="Input search key..."
                  onSearch={getListBuildingBySearch}
                  value={keyword}
                  name={keyword}
                  onChange={handleInputChange}
                  enterButton
                  size="large"
                  style={{
                    width: "30%",
                    marginRight: "77%",
                    marginBottom: 40,
                    marginLeft: 10,
                  }}
                />

                <Table columns={column} dataSource={buildingList} />
                <br />
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
}
export default BuildingTable;
