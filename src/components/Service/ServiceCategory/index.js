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
} from "antd";
// import { Table } from "reactstrap";
import "antd/dist/antd.css";
import "../ServiceCategory/style.css";
import { getAuth, postAuth } from "../../../Util/httpHelper";
import { PlusSquareOutlined } from "@ant-design/icons";
const { Content } = Layout;
const { Search } = Input;

function ServiceCategoryTable() {
  const [cateList, setCateList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nameCategory, setNameCategory] = useState("");
  const [description, setDescription] = useState("");
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const [formAdd] = Form.useForm();

  // doi tui ti
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function handleInputChange(e) {
    setKeyword(e.target.value);
  }

  useEffect(() => {
    getListCate(currentPage);
  }, []);

  async function handleNextPage() {
    setCurrentPage(currentPage + 1);
    getListCate(currentPage + 1);
  }

  async function handleBackPage() {
    setCurrentPage(currentPage - 1);
    getListCate(currentPage - 1);
  }

  async function getListCate(page) {
    console.log('Current: ', page)
    getAuth(`/service-categories?hotel-id=2&page-index=${page}`).then(
      (response) => {
        if (response.status === 200) {
          setCateList([...response.data.data.data]);
          setTotalPage(response.data.data.totalPage);
        }
      }
    );
  }

  function getCateListBySearch() {
    getAuth(`/service-categories?name=${keyword}&hotel-id=2`).then(
      (response) => {
        if (response.status === 200) {
          setCateList([...response.data.data.data]);
        }
      }
    );
  }

  function getCateByID() {}

  const addCategory = () => {
    postAuth(`/service-categories`, {
      nameCatService: nameCategory,
      description: description,
      hotelId: 2,
    }).then((response) => {
      if (response.status === 201) {
        message.success("Input Successfully");
        setIsModalVisible(false);
        formAdd.resetFields();
        setCateList([...response.data.data.data]);
      }
    });
  };
  const index = 1;
  const column = [
    {
      title: "No",
      dataIndex: index,
    },
    {
      title: "Category name",
      dataIndex: nameCategory,
    },
    {
      title: "Description",
      dataIndex: description,
    },
    {
      title: "Action",
      render: () => {
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
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-pencil-square"
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path
                  fill-rule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                />
              </svg>
            </Button>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-trash-fill"
                viewBox="0 0 16 16"
              >
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
              </svg>
            </Button>
          </>
        );
      },
    },
  ];

cateList.map((cate) => {
    return (
      [
        {
          key: cate.id,
          nameCategory: cate.nameCatService,
          description: cate.description
        }
      ]
    )
  });

  console.log("List:", cateList);
  const editCategory = () => {};

  const deleteCategory = () => {};

  return (
    <div>
      <Modal
        title="Service Category Form"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="back"
            onClick={handleCancel}
            style={{
              height: 35,
              width: 100,
              borderRadius: 6,
              backgroundColor: "#6A5ACD",
              color: "white",
            }}
          >
            Return
          </Button>,
          <Button
            type="primary"
            htmlType="submit"
            style={{
              borderColor: "#11cdef",
              height: 50,
              width: 120,
              borderRadius: 6,
              backgroundColor: "#11cdef",
              boxShadow:
                "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
            }}
            onClick={addCategory}
          >
            Submit
          </Button>,
        ]}
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
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
          ></Form.Item>
        </Form>
      </Modal>

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
                <h1 style={{textAlign: 'center'}}>
                  <Button disabled={currentPage <= 1} onClick={handleBackPage} style={{marginRight: 20}}>
                    Back
                  </Button>
                  {currentPage}/{totalPage}
                  <Button
                    disabled={currentPage >= totalPage}
                    onClick={handleNextPage}
                    style={{marginLeft: 20}}
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
export default ServiceCategoryTable;
