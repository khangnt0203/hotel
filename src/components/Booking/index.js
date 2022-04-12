import {
    DeleteFilled,
    EditFilled,
    MinusCircleOutlined,
    PlusOutlined, PlusSquareOutlined,
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
    Layout, message,
    Select,
    Space,
    Tabs,
    DatePicker, notification, Popconfirm, Modal, Table
} from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { getHotel } from "../../Util/Auth";
import {delAuth, getAuth, postAuth, putAuth} from "../../Util/httpHelper";
import TextArea from "antd/es/input/TextArea";
const { Search } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
export default function Booking() {
  const [building, setBuilding] = useState([]);
  const [listRoomType, setListRoomtype] = useState([]);
  const [roomType, setRoomtype] = useState(1);


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

  async function getRoomtype() {
    getAuth(`/hotels/${chosen}/room-types`).then((response) => {
      let map = new Map();
      if (response.status === 200) {
        response.data.data.map((e) => {
          map.set(e.id, e);
        });
        setListRoomtype([...map.values()]);
      }
    });
  }

  //add service
    const addBooking= (values)=>{

    postAuth(`/bookings`, {
        hotelId: chosen,
        roomQuantity: 2,
        duration: 10,
        bookingStatus: 1,
        customer: values.customer,
        channelBookingId: 1,
        adultAmount: values.adultAmount,
        childAmount: values.childAmount,
        bookingDetails:values.bookingDetails
    })
        .then((response)=>{
          if (response.status === 200) {
            //message.success("Input Successfully");
              response.data.data.bookingDetails.map((e) => {
                  addOrder(values, e);
              });

            //setIsModalVisible(false);
            //getListCate(currentPage);
            //form.resetFields();
          }
        })
  };

    const addOrder= (values, bookingDetails)=>{

        postAuth(`/orders`, {
            hotelId: chosen,
            checkinDate: toTimestamp(values.checkinDate),
            checkoutDate: toTimestamp(values.checkoutDate),
            note: "",
            roomId: 1033,
            bookingDetailId: bookingDetails,
            orderStatus: 1,
            services: [
                {
                    serviceId: 18,
                    quantity: 1
                },

            ],
            customers: [
                {
                    fullName: values.customer,
                    phone: values.phone
                }
            ]
        })
            .then((response)=>{
                if (response.status === 201) {

                    message.success("Input Successfully");
                    //setIsModalVisible(false);
                    //getListCate(currentPage);
                    //form.resetFields();
                }
            })
    };
    const [cateList, setCateList] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
    const [idCategory, setIdCategory] = useState("");
    const [nameCategory, setNameCategory] = useState("");
    const [description, setDescription] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState();
    const [formAdd] = Form.useForm();
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

    const showModalUpdate = () => {
        console.log(selectedCategory);
        setIsModalUpdateVisible(true);
    };

    useEffect(() => {
        getListCate(currentPage);
    }, []);

    // update form update when selectedCAtegory change
    useEffect(() => {
        if (selectedCategory) {
            formUpdate.setFieldsValue({
                nameCategory: selectedCategory.nameCatService,
                description: selectedCategory.description,
            });
        }
    }, [selectedCategory]);
    //load data
    async function getListCate(page) {
        console.log("Current: ", page);
        getAuth(`/service-categories?hotel-id=${chosen}&page-index=${page}`).then(
            (response) => {
                let map = new Map();
                if (response.status === 200) {
                    response.data.data.map((e) => {
                        map.set(e.id, e);
                    });
                    console.log(map);
                    setCateList([...map.values()]);
                }
            }
        );
    }
    //search
    function getCateListBySearch() {
        getAuth(`/service-categories?name=${keyword}&hotel-id=${chosen}`).then(
            (response) => {
                let map = new Map();
                if (response.status === 200) {
                    response.data.data.map((e) => {
                        map.set(e.id, e);
                    });
                    setCateList([...map.values()]);
                }
            }
        );
    }

    //add category
    const addCategory = () => {
        postAuth(`/service-categories`, {
            nameCatService: nameCategory,
            description: description,
            hotelId: chosen,
        }).then((response) => {
            if (response.status === 201) {
                message.success("Input Successfully");
                setIsModalVisible(false);
                getListCate(currentPage);
                formAdd.resetFields();
            }
        });
    };
    //edit category
    const editCategory = (values) => {
        putAuth(`/service-categories`, {
            id: idCategory,
            nameCatService: values.nameCategory,
            description: values.description,
            hotelId: chosen,
            status: true,
        }).then((response) => {
            if (response.status === 200) {
                message.success("Update Successfully");
                setIsModalUpdateVisible(false);
                getListCate(currentPage);
            }
        });
    };
    //delete category
    const deleteCategory = (id) => {
        console.log(id);
        delAuth(`/service-categories/${id}`).then((response) => {
            if (response.status === 200) {
                message.success("Delete Successfully");
                getListCate(currentPage);
            }
        });
    };
    const column = [
        {
            title: "No",
            key: "nameCatService",
            render: (e, item, index) => {
                return <>{index + 1}</>;
            },
        },
        {
            title: "Category name",
            key: "nameCatService",
            dataIndex: "nameCatService",
        },
        {
            title: "Description",
            key: "nameCatService",
            dataIndex: "description",
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
                                setIdCategory(item.id);
                                setSelectedCategory(item);
                                setIsModalUpdateVisible(true);
                            }}
                        >
                            <EditFilled />
                        </Button>
                        <Popconfirm
                            title="Are you sure to delete this Category?"
                            onConfirm={() => {
                                deleteCategory(item.id);
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
                  <TabPane tab="Create Booking" key="1">

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
                          onFinish={addBooking}
                          onFinishFailed={onFinishFailed}
                          autoComplete="off"
                      >
                          <Form.Item
                              label="Guest name:"
                              name="customer"
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
                          <Form.Item label="Date Booking" style={{ marginBottom: 0 }}>
                              <Form.Item
                                  name="checkinDate"
                                  style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                              >
                                  <DatePicker />
                              </Form.Item>
                              <span
                                  style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}
                              >
        -
      </span>
                              <Form.Item  name="checkoutDate" style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                                  <DatePicker />
                              </Form.Item>
                          </Form.Item>
                          <Form.Item

                              label="No. Adult"
                              name={ "adultAmount"}
                              rules={[
                                  {
                                      required: true,
                                      message: "Missing Adult",
                                  },
                              ]}
                          >
                              <InputNumber  placeholder="Adult" />
                          </Form.Item>
                          <Form.Item>
                              <Form.Item

                                  label="No. Child"
                                  name={ "childAmount"}
                                  rules={[
                                      {
                                          required: true,
                                          message: "Missing Child",
                                      },
                                  ]}
                              >
                                  <InputNumber  placeholder="Child" />
                              </Form.Item>
                          </Form.Item>
                          <Form.List name="bookingDetails">
                              {(fields, { add, remove }) => (
                                  <>
                                      {fields.map(({ key, name, ...restField }) => (
                                          <Space key={key}>
                                              <Form.Item
                                                  {...restField}
                                                  label="Room type:"
                                                  name={[name, "roomTypeId"]}
                                              >
                                                  <Select
                                                      defaultValue={listRoomType[0].name}
                                                      style={{ width: 120, marginLeft: 30, marginRight: 20 }}
                                                      onChange={(e) => setRoomtype(e.id)}
                                                  >
                                                      {listRoomType.map((cate) => (
                                                          <Option key={cate.id} value={cate.id}>
                                                              {cate.name}
                                                          </Option>
                                                      ))}
                                                  </Select>
                                              </Form.Item>
                                              <Form.Item
                                                  {...restField}
                                                  label="Quantity"
                                                  name={[name, "roomTypeQuantity"]}
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
                                                  label="Note"
                                                  name={[name, "note"]}
                                                  rules={[]}>
                                                  <TextArea style={{marginLeft: 40}} placeholder="Note" />
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
                  <TabPane tab="Booking List" key="2">

                      <Form
                          key={selectedCategory.id}
                          name="basic"
                          form={formUpdate}
                          labelCol={{
                              span: 8,
                          }}
                          wrapperCol={{
                              span: 40,
                          }}
                          autoComplete="off"
                          onFinish={editCategory}
                      >
                          <div>Name Category</div>
                          <Form.Item
                              name="nameCategory"
                              rules={[
                                  {
                                      required: true,
                                      message: "This field is required!",
                                  },
                              ]}
                          >
                              <Input
                                  placeholder="Name Category"
                                  name="nameCategory"
                                  onChange={(e) => setNameCategory(e.target.value)}
                                  style={{
                                      height: 50,
                                     
                                      borderRadius: 6,
                                  }}
                              />
                          </Form.Item>
                          <div>Description</div>
                          <Form.Item
                              name="description"
                              rules={[
                                  {
                                      required: true,
                                      message: "This field is required!",
                                  },
                              ]}
                          >
                              <Input.TextArea
                                  placeholder="Description"
                                  rows={8}
                                  name="description"
                                  onChange={(e) => setDescription(e.target.value)}
                                  style={{
                                     
                                      borderRadius: 6,
                                  }}
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
                              >
                                  Save
                              </Button>
                          </Form.Item>
                      </Form>


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
                                  Service Category Management
                              </Breadcrumb.Item>
                              <Breadcrumb.Item>Service</Breadcrumb.Item>
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
                                          Service Category Management
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
                                          New Category
                                      </Button>
                                      <hr color="#F2F2F2" />
                                      <br />
                                      <Search
                                          placeholder="Input search key..."
                                          onSearch={getCateListBySearch}
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
                                      <Table columns={column} dataSource={cateList} />
                                      <br />
                                  </div>
                              </div>
                          </div>
                      </Content>
                  </Layout>


                  </TabPane>
                </Tabs>
                <br />
              </div>
            </div>
          </div>
        </Content>
      </Layout>
      {console.log(listRoomType)}
    </div>
  );
}
function toTimestamp(strDate){ var datum = Date.parse(strDate); return datum/1000;}
