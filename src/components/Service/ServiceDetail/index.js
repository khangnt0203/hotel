import React, { useEffect } from "react";
import { Button, Input, Breadcrumb, Layout } from "antd";
import "antd/dist/antd.css";
import "../ServiceDetail/style.css";
import { Table } from "reactstrap";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getAuth } from "../../../Util/httpHelper";

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

  useEffect(() => {
    getListCate();
  }, []);

  async function handleInputChange(e) {
    setKeyword(e.target.value);
  }

  function getListCate() {
    getAuth("/service-categories?hotel-id=2").then((response) => {
      let map = new Map();
      if (response.status === 200) {
        response.data.data.data.map((e) => {
          map.set(e.id, e);
        });
        setCateList([...map.values()]);
      }
    });
  }


  function getListServiceByCate(e) {
    setKeyCate(e.target.value)
    getAuth(`/services?service-category-id=${e.target.value}`).then((response) => {
      if (response.status === 200) {
        setServiceList([...response.data.data.data]);
      }
    });
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
              <Table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Service Name</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceList.map((service,index) => (
                    <tr key={service.id}>
                      <td> {(index+1)}</td>
                      <td>{service.nameService}</td>
                      <td>{service.price}</td>
                      <td>
                        <Button
                          type="danger"
                          style={{
                            borderRadius: 3,
                            height: 45,
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
export default ServiceTable;
