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
} from "antd";
import "antd/dist/antd.css";
import "../ServiceCategory/style.css";
import { delAuth, getAuth, postAuth, putAuth } from "../../../Util/httpHelper";
import {
  PlusSquareOutlined,
  DeleteFilled,
  EditFilled,
} from "@ant-design/icons";
import { getHotel } from "../../../Util/Auth";

const { Content } = Layout;
const { Search } = Input;

function ServiceCategoryTable() {
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
let chosen = getHotel();
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
  return (
    <div>
      <Modal
        title="Service Category Add Form"
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
                boxShadow:
                  "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
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
                boxShadow:
                  "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
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
              onClick={addCategory}
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
          {selectedCategory ? (
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
                    boxShadow:
                      "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
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
                    boxShadow:
                      "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
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
    </div>
  );
}
export default ServiceCategoryTable;
