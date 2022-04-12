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
  Divider,
  Drawer,
  Col,
  Card,
  Descriptions,
  Row,
  Upload,
} from "antd";
import "antd/dist/antd.css";
import "../RoomType/style.css";

import FormControl from "@mui/material/FormControl";

import {
  DeleteFilled,
  EditFilled,
  PlusSquareOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  delAuth,
  getAuth,
  putAuth,
  postForm,

} from "../../Util/httpHelper";
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
function ServiceTable() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [roomTypeList, setRoomTypeList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [keyword, setKeyword] = useState([]);
  const [keyCate, setKeyCate] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceName, setServiceName] = useState();
  const [price, setPrice] = useState();
  const [cate, setCate] = useState();
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState();
  const [totalPage, setTotalPage] = useState();
  const [name, setName] = useState();
  const [facilities, setFacilities] = useState();
  const [defaultAdult, setDefaultAdult] = useState();
  const [maxAdult, setMaxAdult] = useState();
  const [defaultChild, setDefaultChild] = useState();
  const [maxChild, setMaxChild] = useState();
  const [cateList, setCateList] = useState();
  const [roomTypeId, setRoomTypeId] = useState();
  const [selectedFile, setSelectedFile] = useState();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsModalUpdateVisible(false);
    formAdd.resetFields();
  };
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  function handleInputChange(e) {
    setKeyword(e.target.value);
  }
  useEffect(() => {
    getRoomTypeList(currentPage);
    getListCate();
  }, []);

  async function handleInputChange(e) {
    setKeyword(e.target.value);
  }

  let chosen = getHotel();

  function getRoomTypeList(currentPage) {
    getAuth(`/room-types?hotel-id=${chosen}&page-index=${currentPage}`).then(
      (response) => {
        let map = new Map();
        if (response.status === 200) {
          response.data.data.data.map((e) => {
            map.set(e.id, e);
          });
          setRoomTypeList([...map.values()]);
          setTotalPage(response.data.data.totalPage);
        }
      }
    );
  }

  async function loadCate(e) {
    await setCate(e);
    console.log(cate);
  }

  useEffect(() => {
    if (selectedRoomType) {
      formUpdate.setFieldsValue({
        name: selectedRoomType.name,
        facilities: selectedRoomType.facilities,
        defaultAdult: selectedRoomType.defaultAdult,
        maxAdult: selectedRoomType.maxAdult,
        defaultChild: selectedRoomType.defaultChild,
        maxChild: selectedRoomType.maxChild,
      });
    }
  }, [selectedRoomType]);
  function getListCate() {
    getAuth(`/services?hotel-id=${chosen}`).then((response) => {
      let map = new Map();
      if (response.status === 200) {
        response.data.data.data.map((e) => {
          map.set(e.id, e);
        });
        setCateList([...map.values()]);
      }
    });
  }
  async function handleChangePage(page) {
    await setCurrentPage(page);
    getRoomTypeList(page);
  }
  const column = [
    {
      title: "No",
      key: "name",
      render: (e, item, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: "Room Type name",
      key: "name",
      render: (e) => {
        return (
          <a
            onClick={() => {
              setSelectedRoomType(e);
              showDrawer();
            }}
          >
            {e.name}
          </a>
        );
      },
    },

    {
      title: "Facilities",
      key: "name",
      dataIndex: "facilities",
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
                setRoomTypeId(item.id);
                setSelectedRoomType(item);
                setIsModalUpdateVisible(true);
              }}
            >
              <EditFilled />
            </Button>
            <Popconfirm
              title="Are you sure to delete this Room Type?"
              onConfirm={() => {
                deleteRoomType(item.id);
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
  //add roomtype
  const addRoomType = () => {
    let formData = new FormData();
    formData.append("name", name);
    formData.append("facilities", facilities);
    formData.append("defaultAdult", defaultAdult);
    formData.append("maxAdult", maxAdult);
    formData.append("defaultChild", defaultChild);
    formData.append("maxChild", maxChild);
    formData.append("serviceids", cate);
    formData.append("hotelid", chosen);
    formData.append("image", selectedFile);
    console.log("data:", formData);

    postForm(`/room-types`, formData).then((response) => {
      if (response.status === 201) {
        message.success("Add Successfully");
        setIsModalVisible(false);
        getRoomTypeList(currentPage);
        formAdd.resetFields();
      }
    });
  };
  //delete
  const deleteRoomType = (id) => {
    delAuth(`/room-types/${id}`).then((response) => {
      if (response.status === 200) {
        message.success("Delete Successfully");
        getRoomTypeList(currentPage);
      }
    });
  };
  //edit
  const editRoomType = (values) => {
   console.log('roomtype', values.name)
    putAuth(`/room-types`, {
      name: values.name,
      facilities: values.facilities,
      defaultAdult: values.defaultAdult,
      maxAdult: values.maxAdult,
      defaultChild: values.defaultChild,
      maxChild: values.maxChild,
      hotelId: chosen,
      status: true,
      id: roomTypeId,
      serviceids: [cate],
    }).then((response) => {
      if (response.status === 200) {
        message.success("Update Successfully");
        setIsModalUpdateVisible(false);
        getRoomTypeList(currentPage);
      }
    });
  
  };

  return (
    <div>
      <Modal
        title="Room Type Form"
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
          enctype="multipart/form-data"
        >
          <div>Name Room Type</div>
          <Form.Item
            name="Name Room Type"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
          >
            <Input
              placeholder="Name Room Type"
              name="name"
              type="text"
              style={{
                height: 50,

                borderRadius: 6,
              }}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <div>Facilities</div>
          <Form.Item
            name="Facilities"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
          >
            <Input
              placeholder="Facilities"
              name="facilities"
              type="text"
              style={{
                height: 50,
                width: "100%",
                borderRadius: 6,
              }}
              onChange={(e) => setFacilities(e.target.value)}
            />
          </Form.Item>

          <Row>
            <Col span={12}>
              <div>Default Adult</div>
              <Form.Item
                name="Default Adult"
                rules={[
                  {
                    required: true,
                    message: "This field is required!",
                  },
                ]}
              >
                <Input
                  type="number"
                  name="defaultAdult"
                  placeholder="0"
                  style={{
                    height: 50,
                    width: "50%",
                    borderRadius: 6,
                  }}
                  onChange={(e) => setDefaultAdult(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <div>Max Adult</div>
              <Form.Item
                name="Max Adult"
                rules={[
                  {
                    required: true,
                    message: "This field is required!",
                  },
                ]}
              >
                <Input
                  type="number"
                  name="maxAdult"
                  placeholder="0"
                  style={{
                    height: 50,
                    width: "50%",
                    borderRadius: 6,
                  }}
                  onChange={(e) => setMaxAdult(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <div>Default Child</div>
              <Form.Item
                name="Default Child"
                rules={[
                  {
                    required: true,
                    message: "This field is required!",
                  },
                ]}
              >
                <Input
                  type="number"
                  name="defaultChild"
                  placeholder="0"
                  style={{
                    height: 50,
                    width: "50%",
                    borderRadius: 6,
                  }}
                  onChange={(e) => setDefaultChild(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <div>Max Child</div>
              <Form.Item
                name="Max Child"
                rules={[
                  {
                    required: true,
                    message: "This field is required!",
                  },
                ]}
              >
                <Input
                  type="number"
                  name="maxChild"
                  placeholder="0"
                  style={{
                    height: 50,
                    width: "50%",
                    borderRadius: 6,
                  }}
                  onChange={(e) => setMaxChild(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Service">
            <FormControl sx={{ width: 300 }}>
              <Select placeholder="Select Service..." onChange={loadCate}>
                {cateList?.map((cate) => (
                  <Option key={cate.id} value={cate.id}>
                    {cate.nameService}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Form.Item>
          <Form.Item>
            <Input
              type="file"
              onChange={(e) => setSelectedFile(e.target.value)}
            />
          </Form.Item>
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
              onClick={addRoomType}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <>
      
        <Modal
          title="Room Type Update Form"
          visible={isModalUpdateVisible}
          onOk={() => {
            setIsModalUpdateVisible(false);
          }}
          onCancel={() => {
            setIsModalUpdateVisible(false);
          }}
          footer={false}
        >
          {selectedRoomType ? (
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
              onFinish={editRoomType}
            >
              <div>Name Room Type</div>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "This field is required!",
                  },
                ]}
              >
                <Input
                  placeholder="Name Room Type"
                  name="name"
                  type="text"
                  style={{
                    height: 50,

                    borderRadius: 6,
                  }}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
              <div>Facilities</div>
              <Form.Item
                name="facilities"
                rules={[
                  {
                    required: true,
                    message: "This field is required!",
                  },
                ]}
              >
                <Input
                  placeholder="Facilities"
                  name="facilities"
                  type="text"
                  style={{
                    height: 50,
                    width: "100%",
                    borderRadius: 6,
                  }}
                  onChange={(e) => setFacilities(e.target.value)}
                />
              </Form.Item>

              <Row>
                <Col span={12}>
                  <div>Default Adult</div>
                  <Form.Item
                    name="defaultAdult"
                    rules={[
                      {
                        required: true,
                        message: "This field is required!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      name="defaultAdult"
                      placeholder="0"
                      style={{
                        height: 50,
                        width: "50%",
                        borderRadius: 6,
                      }}
                      onChange={(e) => setDefaultAdult(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <div>Max Adult</div>
                  <Form.Item
                    name="maxAdult"
                    rules={[
                      {
                        required: true,
                        message: "This field is required!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      name="maxAdult"
                      placeholder="0"
                      style={{
                        height: 50,
                        width: "50%",
                        borderRadius: 6,
                      }}
                      onChange={(e) => setMaxAdult(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <div>Default Child</div>
                  <Form.Item
                    name="defaultChild"
                    rules={[
                      {
                        required: true,
                        message: "This field is required!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      name="defaultChild"
                      placeholder="0"
                      style={{
                        height: 50,
                        width: "50%",
                        borderRadius: 6,
                      }}
                      onChange={(e) => setDefaultChild(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <div>Max Child</div>
                  <Form.Item
                    name="maxChild"
                    rules={[
                      {
                        required: true,
                        message: "This field is required!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      name="maxChild"
                      placeholder="0"
                      style={{
                        height: 50,
                        width: "50%",
                        borderRadius: 6,
                      }}
                      onChange={(e) => setMaxChild(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Service">
                <FormControl sx={{ width: 300 }}>
                  <Select placeholder="Select Service..." onChange={loadCate}>
                    {cateList?.map((cate) => (
                      <Option key={cate.id} value={cate.id}>
                        {cate.nameService}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </Form.Item>

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
          ) : (
            <>Lỗi rùi bé iu</>
          )}
        </Modal>
      </>
      <Drawer
        title="Room Type Information"
        placement="right"
        onClose={onClose}
        visible={visible}
        width={900}
      >
        <Row gutter={20}>
          <Col span={8}>
            {selectedRoomType ? (
              <Card bordered={false}>
                <img
                  style={{ witdh: 200, height: 200 }}
                  src={selectedRoomType.image}
                  alt="Image is not available"
                />
              </Card>
            ) : null}
          </Col>

          {selectedRoomType ? (
            <Col span={15}>
              <Card bordered={false}>
                <Descriptions bordered>
                  <Descriptions.Item label="Name" span={3}>
                    {selectedRoomType.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Facilities" span={3}>
                    {selectedRoomType.facilities}
                  </Descriptions.Item>
                  <Descriptions.Item label="Default Adult" span={1.5}>
                    {selectedRoomType.defaultAdult}
                  </Descriptions.Item>
                  <Descriptions.Item label="Max Adult" span={1.5}>
                    {selectedRoomType.maxAdult}
                  </Descriptions.Item>
                  <Descriptions.Item label="Default Child" span={1.5}>
                    {selectedRoomType.defaultChild}
                  </Descriptions.Item>
                  <Descriptions.Item label="Max Child" span={1.5}>
                    {selectedRoomType.maxChild}
                  </Descriptions.Item>
                  <Descriptions.Item label="Service">
                    <p>
                      Name service:{" "}
                      {selectedRoomType.services.map((e) => e.nameService)}
                    </p>
                    <p>
                      Descriptions:{" "}
                      {selectedRoomType.services.map((e) => e.description)}
                    </p>
                    <p>
                      Price: {selectedRoomType.services.map((e) => e.price)}
                    </p>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          ) : null}
        </Row>
      </Drawer>
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
            <Breadcrumb.Item>Room Type</Breadcrumb.Item>
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
                  Room Type Management
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
                  New
                </Button>
                <hr color="#F2F2F2" />
                <br />

                <Table
                  columns={column}
                  dataSource={roomTypeList}
                  pagination={false}
                />
                <h1 style={{ marginLeft: "40%", marginTop: 10 }}>
                  <Button
                    disabled={currentPage < totalPage}
                    onClick={() => handleChangePage(currentPage - 1)}
                  >
                    Back
                  </Button>{" "}
                  {currentPage}/{totalPage}{" "}
                  <Button
                    disabled={currentPage >= totalPage}
                    onClick={() => handleChangePage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </h1>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
}
export default ServiceTable;
