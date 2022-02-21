import React from "react";
import { Button, Table, Input } from "antd";
import "antd/dist/antd.css";

const { Search } = Input;

const columns = [
  {
    title: "No",
    dataIndex: "No",
  },
  {
    title: "Building Name",
    dataIndex: "BuildingName",
    sorter: {
      compare: (a, b) => a.BuildingName - b.BuildingName,
      multiple: 3,
    },
  },
  {
    title: "Total Floor",
    dataIndex: "Floor",
    sorter: {
      compare: (a, b) => a.Floor - b.Floor,
      multiple: 2,
    },
  },
  {
    title: "Total Room",
    dataIndex: "Room",
    sorter: {
      compare: (a, b) => a.english - b.english,
      multiple: 1,
    },
  },
  {
    title: "Status",
    dataIndex: "Status",
    sorter: {
      compare: (a, b) => a.english - b.english,
      multiple: 1,
    },
  },
  {
    title: "Action",
    render: () => (
      <>
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
      </>
    ),
  },
];

const data = [
  {
    No: "1",
    BuildingName: "Building A",
    Floor: 95,
    Room: 60,
    Status: 40,
  },
  {
    No: "1",
    BuildingName: "Building B",
    Floor: 98,
    Room: 60,
    Status: 70,
  },
  {
    No: "1",
    BuildingName: "Building B",
    Floor: 98,
    Room: 60,
    Status: 70,
  },
  {
    No: "1",
    BuildingName: "Building A",
    Floor: 98,
    Room: 60,
    Status: 70,
  },
  {
    No: "1",
    BuildingName: "Building A",
    Floor: 98,
    Room: 60,
    Status: 70,
  },
  {
    No: "1",
    BuildingName: "Building A",
    Floor: 98,
    Room: 60,
    Status: 70,
  },
  {
    No: "1",
    BuildingName: "Building A",
    Floor: 98,
    Room: 60,
    Status: 70,
  },
  {
    No: "1",
    BuildingName: "Building A",
    Floor: 98,
    Room: 60,
    Status: 70,
  },
  {
    No: "1",
    BuildingName: "Building A",
    Floor: 98,
    RoomN: 0,
    Status: 70,
  },
];

function onChange(pagination, filters, sorter, extra) {
  console.log("params", pagination, filters, sorter, extra);
}
function BuildingTable() {
  return (
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
          href="/addService"
        >
          Add building
        </Button>
        <hr color="#F2F2F2" />
        <br />

        <Search
          placeholder="Name"
          onSearch={""}
          enterButton
          size="large"
          style={{
            width: "30%",
            marginRight: "77%",
            marginBottom: 40,
            borderRadius: 5,
            marginLeft: 80,
          }}
        />

        <Table columns={columns} dataSource={data} onChange={onChange}></Table>
      </div>
    </div>
  );
}
export default BuildingTable;
