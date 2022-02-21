/*!

=========================================================
* Argon Dashboard PRO React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from "react";

// react plugin that prints a given react component
import ReactToPrint from "react-to-print";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { dataTable } from "variables/general";
import ReactBSAlert from "react-bootstrap-sweetalert";
import cellEditFactory from 'react-bootstrap-table2-editor';
import {Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  FormGroup,
  Input,
  Modal,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components




const pagination = paginationFactory({
  page: 1,
  alwaysShowAllBtns: true,
  showTotal: true,
  withFirstAndLast: false,
  sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
    <div className="dataTables_length" id="datatable-basic_length">
      <label>
        Show{" "}
        {
          <select
            name="datatable-basic_length"
            aria-controls="datatable-basic"
            className="form-control form-control-sm"
            onChange={(e) => onSizePerPageChange(e.target.value)}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        }{" "}
        entries.
      </label>
    </div>
  ),
});

const MySearch = (props) => {
  let input;
  const handleClick = () => {
    props.onSearch(input.value);
  };
  return (
    <div>
      <input
        className="form-control"
        style={{ backgroundColor: 'white', width:300,}}
        ref={n => input = n}
        type="text"
        placeholder="Search"
      />
      <button className="btn " color="secondary" onClick={handleClick} ><i class="fa fa-search" aria-hidden="true"></i></button>
    </div>
  );
};
const { SearchBar } = Search;

function ReactBSTables() {
 
  const [defaultModal, setdefaultModal] = React.useState(false);
 
  const notificationAlertRef = React.useRef(null);
  const [alert, setAlert] = React.useState(null);
  const componentRef = React.useRef(null);
  // this function will copy to clipboard an entire table,
  // so you can paste it inside an excel or csv file
  const copyToClipboardAsTable = (el) => {
    var body = document.body,
      range,
      sel;
    if (document.createRange && window.getSelection) {
      range = document.createRange();
      sel = window.getSelection();
      sel.removeAllRanges();
      try {
        range.selectNodeContents(el);
        sel.addRange(range);
      } catch (e) {
        range.selectNode(el);
        sel.addRange(range);
      }
      document.execCommand("copy");
    } else if (body.createTextRange) {
      range = body.createTextRange();
      range.moveToElementText(el);
      range.select();
      range.execCommand("Copy");
    }
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Good job!"
        onConfirm={() => setAlert(null)}
        onCancel={() => setAlert(null)}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        Copied to clipboard!
      </ReactBSAlert>
    );
  };

  const [listObject, setListObject] = React.useState(dataTable)
  const handleDelete = nameId => {
    for (var i = 0; i < listObject.length - 1; i++) {
      if (listObject[i].name === nameId) { 
        var deleteObject = [...listObject];
        deleteObject.splice(i, 1)
        setListObject(deleteObject);   
        console.log(listObject[i].name)
      }
    }
  };


 
  

  const notify = (type) => {
    let options = {
      place: "tc",
      message: (
        <div className="alert-text">
          <span className="alert-title" data-notify="title">
            {" "}
            Bootstrap Notify
          </span>
          <span data-notify="message">
            Turning standard Bootstrap alerts into awesome notifications
          </span>
        </div>
      ),
      type: type,
      icon: "ni ni-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  return (
    <>
      {alert}
      <SimpleHeader name="Building Management" parentName="Hotel Management" />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader>
                <h3 className="mb-0" style={{ fontSize: 50 }}>Building Management</h3>
                <p className="text-sm mb-0">

                </p>
                <Row>
                  <Col md="4">
                  <Link to="/manager/Form" >
                    <Button
                      block
                      className="mb-3"
                      color="secondary"
                      style={{width:150}}
                    
                    >
                     Add Building
                    </Button>
                   </Link>
                  </Col>
                  
                </Row>
              </CardHeader>
              <ToolkitProvider
                data={listObject}
                keyField="name"
                cellEdit={ cellEditFactory({ mode: 'click' }) }
                columns={[
                  {
                    dataField: "name",
                    text: "No",
                    sort: true,
                  },
                  {
                    dataField: "position",
                    text: "Building",
                    sort: true,
                  },
                  {
                    dataField: "office",
                    text: "Total Floor ",
                    sort: true,
                  },
                  {
                    dataField: "salary",
                    text: "Total Room",
                    sort: true,
                  },
                  {
                    dataField: "age",
                    text: "Status",
                    sort: true,
                  },
                  {
                    dataField: "remove",
                    text: "Active",
                    formatter: (cellContent, row) => {
                      return (
                        <div>
                        <button
                          className="btn  btn-danger"
                          color="secondary"
                          onClick={() => handleDelete(row.name,row.position,row.nameId)}>
                         
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg>
                        </button>
                        <Link to="/admin/Floor" >
                         <button
                          className="btn  btn-info"
                          color="secondary"
                          >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg>
                        </button>
                        </Link>
                        </div>
                      );
                    },
                  },
                  
                  

                ]}
                search
              >
                {
                  props => (
                    
                    <div className="py-4 table-responsive">
                    <div
                      id="datatable-basic_filter"
                      
                      className="dataTables_filter px-4 pb-1"
                    >
                      <label>
                      
                        <MySearch
                          className="form-control-sm"
                         
                          placeholder=""
                          {...props.searchProps}
                        />
                      </label>
                    </div>
                    <BootstrapTable
                      {...props.baseProps}
                      bootstrap4={true}
                      pagination={pagination}
                      bordered={false}
                      cellEdit={ cellEditFactory({ mode: 'dbclick' }) }
                    />
                  </div>
                    
                  )
                }
              </ToolkitProvider>
            </Card>

          </div>
        </Row>
      </Container>
    </>
  );
}

export default ReactBSTables;
