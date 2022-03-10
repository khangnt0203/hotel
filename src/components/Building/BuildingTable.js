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
import { delAuth, getAuth, postAuth } from "../../Util/httpHelper";
import { getHotel } from "../../Util/Auth";
const { Content } = Layout;
const { Search } = Input;

function BuildingTable() {
  const [buildingList, setBuildingList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [idBuilding, setIdBuilding] = useState("");
  const [nameBuilding, setNameBuilding] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [totalRoom, setTotalRoom] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedBuilding, setSelectedBuilding] = useState();
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
    getListBuilding(currentPage);
  }, []);

  // update form update when selectedCAtegory change
let chosen = getHotel();
  async function getListBuilding(page) {
    console.log("Current: ", page);
    getAuth(`/buildings?hotel-id=${chosen}&page-index=${page}`).then((response) => {
      let map = new Map();
      if (response.status === 200) {
        response.data.data.map((e) => {
          map.set(e.id, e);
        });
        console.log('1:',map);
        setBuildingList([...map.values()]);
      }
    });
  }
  const deleteBuilding = (id) => {
    delAuth(`/buildings/${id}`).then((response) => {
      if (response.status === 200) {
        message.success("Delete Successfully");
        getListBuilding(currentPage);
      }
    });
  };
  // const addBuilding = () => {
  //   postAuth(`/buildings`, {
  //     nameCatService: nameCategory,
  //     description: description,
  //     hotelId: 2,
  //   }).then((response) => {
  //     if (response.status === 201) {
  //       message.success("Input Successfully");
  //       setIsModalVisible(false);
  //       getListCate(currentPage);
  //       formAdd.resetFields();
  //     }
  //   });
  // };
  useEffect(() => {
    getBuilding();
  }, []);
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
      title: "Floor No",
      key: "id",
      dataIndex: "floorNo",
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
                setSelectedBuilding(e);
                showDrawer();
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
              title="Are you sure to delete this Category?"
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
      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        {selectedBuilding ? <p>{selectedBuilding.buildingName}</p> : <a>Lỗi</a>}
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
                >
                  <PlusSquareOutlined />
                  New Category
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
