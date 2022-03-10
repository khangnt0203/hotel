import React, { useEffect } from "react";
import {
  Button,
  Input,
  Breadcrumb,
  Layout,
  Table,
  Popconfirm,
  message,
} from "antd";
import "antd/dist/antd.css";
import "../ServiceDetail/style.css";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { delAuth, getAuth } from "../../../Util/httpHelper";
import { getHotel, getToken } from "../../../Util/Auth";
import { DeleteFilled, EditFilled } from "@ant-design/icons";

const { Content } = Layout;
const { Search } = Input;

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
  const [cateList, setCateList] = React.useState([]);
  const [serviceList, setServiceList] = React.useState([]);
  const [keyword, setKeyword] = React.useState([]);
  const [keyCate, setKeyCate] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  useEffect(() => {
    getListCate();
    getListServiceByCate(keyCate)
  }, []);

  async function handleInputChange(e) {
    setKeyword(e.target.value);
  }
  const deleteService = (id) => {
    delAuth(`/services/${id}`).then((response) => {
      if (response.status === 200) {
        message.success("Delete Successfully");
        getListServiceByCate(keyCate)
      }
    });
   

  };
  let chosen = getHotel();

  function getListCate() {
    getAuth(`/service-categories?hotel-id=${chosen}`).then((response) => {
      let map = new Map();
      if (response.status === 200) {
        response.data.data.map((e) => {
          map.set(e.id, e);
        });
        setCateList([...map.values()]);
      }
    });
  }

  async function getListServiceByCate(e) {
    await setKeyCate(e.target.value);
    console.log(keyCate);
    let map = new Map();
    getAuth(`/services?service-category-id=${keyCate}`).then(
      (response) => {
        if (response.status === 200) {
          response.data.data.data.map((p) => {
            map.set(p.id, p);
          });
          setServiceList([...map.values()]);
        }
      }
    );
  }

  function getListServiceBySearch() {
    getAuth(`/services?name=${keyword}&service-category-id=${keyCate}`).then(
      (response) => {
        if (response.status === 200) {
          setServiceList([...response.data.data.data]);
        }
      }
    );
  }
  const column = [
    {
      title: "No",
      key: "nameService",
      render: (e, item, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: "Service name",
      key: "nameService",
      dataIndex: "nameService",
    },
    {
      title: "Description",
      key: "nameCatService",
      dataIndex: "description",
    },
    {
      title: "price",
      key: "nameCatService",
      dataIndex: "price",
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
            >
              <EditFilled />
            </Button>
            <Popconfirm
              title="Are you sure to delete this Service?"
              onConfirm={() => {
                deleteService(item.id);
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
            Service Management{" "}
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
                Service Management
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
                href="/addService"
              >
                Add Service
              </Button>
              <hr color="#F2F2F2" />
              <br />
              <Search
                placeholder="Input search key..."
                onSearch={getListServiceBySearch}
                value={keyword}
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

              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-name-label">
                  Service Category
                </InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  input={<OutlinedInput label="Service Category" />}
                  MenuProps={MenuProps}
                  value={keyCate}
                  onChange={getListServiceByCate}
                >
                  {cateList.map((cate) => (
                    <MenuItem key={cate.id} value={cate.id}>
                      {cate.nameCatService}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Table columns={column} dataSource={serviceList} />
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
export default ServiceTable;
