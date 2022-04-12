import React, {useEffect, useState} from "react";
import dateFormat, {masks} from "dateformat";
import {
    Layout, Card,
    Rate,
    Descriptions,
    Button,
    Popconfirm,
    Modal,
    Form,
    Input,
    DatePicker,
    InputNumber, Space, Select, Breadcrumb, Table, message
} from "antd";
import {useHistory} from "react-router-dom";
import "antd/dist/antd.css";
import "../Dashboard/style.css";
import {getAuth, postAuth, putAuth} from "../../Util/httpHelper";
import Headnav from "../Header";
import "../HomePage/style.css";

import {
    EditOutlined,
    SettingOutlined,
    CheckOutlined,
    EditFilled,
    DeleteFilled,
    MinusCircleOutlined, PlusOutlined, PlusSquareOutlined
} from "@ant-design/icons";
import {getBookingId, getHotel, setBookingId, setHotel} from "../../Util/Auth";
import TextArea from "antd/es/input/TextArea";
import FormControl from "@mui/material/FormControl";
import {isDisabled} from "@testing-library/user-event/dist/utils";

import Sidebar from "../Sider";

const orderStatusList = [{value: 1, name: "Request"},
    {value: 2, name: "Confirm"},
    {value: 3, name: "Staying"},
    {value: 4, name: "Done"},
    {value: 4, name: "Cancel"},];
const {Meta} = Card;
const {Content} = Layout;
const {Search} = Input;
const {Option} = Select;
export default function OrderList() {
    const [orderList, setOrderList] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [isVisible, setIsVisible] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState();
    const [selectedRoom, setSelectedRoom] = useState();
    const [selectedOrder, setSelectedOrder] = useState();
    const [selectedRoomType, setSelectedRoomType] = useState();
    const [listRoom, setListRoom] = useState([]);
    const [formAdd] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const showModal = () => {
        setIsModalUpdateVisible(true);
    };
    const history = useHistory();
    let chosen = getHotel();
    let bookingId = getBookingId();
    const handleOk = () => {
        setIsModalUpdateVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsModalUpdateVisible(false);
    };

    const handleShow = (order) => {
        setSelectedOrder(order);
        SearchRoomType(order.roomType,order.checkinDate);
        setIsModalUpdateVisible(true);
    };
    const handleClose = () => {
        setIsVisible(false);
    };

    function handleInputChange(e) {
        setKeyword(e.target.value);
    }

    async function loadroom(e) {
        await setSelectedRoom(e);
        console.log(selectedRoom);
    }

    useEffect(() => {
        getOrder();
    }, []);

    function getOrder() {
        getAuth(`/orders?hotel-id=${chosen}&booking-id=${bookingId}&status=true`).then((respone) => {
            let map = new Map();

            if (respone.status === 200) {
                respone.data.data.data.map((e) => {
                    map.set(e.id, e);
                });
                setOrderList([...map.values()]);
                console.log(setOrderList)
            }
        });
    }

    function SearchRoomType(roomtype,date) {
        getAuth(`/room-types?status=true&name=${roomtype}&hotel-id=${chosen}`).then((respone) => {
            let map = new Map();

            if (respone.status === 200) {
                respone.data.data.data.map((e) => {
                    map.set(e.id, e);
                    SearchRoom(e.id,date)
                    setSelectedRoomType(e);
                });


            }
        });
    }

    async function SearchRoom(roomtype,date) {
        getAuth(`/rooms?status=true&room-type=${roomtype}&hotel-id=${chosen}&date-pick=${date}`).then((respone) => {
            let map = new Map();

            if (respone.status === 200) {
                respone.data.data.data.map((e) => {
                    map.set(e.id, e);
                });
                setListRoom([...map.values()]);
            }
        });
    }

    async function UpdateOrder() {

        putAuth(`/orders`, {
            status:true,
            id: selectedOrder.id,
            hotelId: chosen,
            checkinDate: selectedOrder.checkinDate,
            checkoutDate: selectedOrder.checkoutDate,
            note: selectedOrder.note,
            roomId: selectedRoom,
            bookingDetailId: selectedOrder.bookingDetailId,
            orderStatus: 3,
            serviceDTOs: [
                {
                    serviceId: selectedOrder.services[0].id,
                    quantity: selectedOrder.services[0].quantity
                },

            ],
        })
            .then((response) => {
                if (response.status === 200) {

                    message.success("Input Successfully");
                    setIsModalUpdateVisible(false);
                    getOrder(currentPage);
                    formUpdate.resetFields();
                }
            })
    };
    const checkout = () => {
        putAuth(`/orders/${selectedOrder.id}/update-status/4`).then((response) => {
            if (response.status === 200) {
                message.success("Update Successfully");
                getOrder(currentPage);
            }
        });
    };
    const setting = () => {
        setHotel(selectedHotel.id);
        history.push('/manager')

    };


    const gridStyle = {
        width: "29%",
        marginLeft: "2%",
        marginTop: "2%",
        textAlign: "center",
    };
    return (
        <div>
            <Modal
                title="Check In"
                visible={isModalUpdateVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={false}
            >
                {selectedOrder ? (

                    <Form
                        key={selectedOrder.id}
                        name="basic"
                        form={formUpdate}
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 40,
                        }}
                        autoComplete="off"
                        onFinish={UpdateOrder}
                    >
                        <h3>Pick Room</h3>
                        <Select
                            placeholder="Select Room..."
                            onChange={setSelectedRoom}
                        >
                            {listRoom.map((room) => (
                                <Option key={room.id} value={room.id}>
                                    {room.roomNo}
                                </Option>
                            ))}
                        </Select>


                        <Form.Item
                            style={{marginLeft: 150}}
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
            <div>
                <Layout className="site-layout"
                        style={{minHeight: "100vh", marginLeft: 200, overflow: "hidden"}}
                >
                    {console.log("hotel:", getHotel())}
                    <Sidebar/>
                    <Layout>
                        <Headnav/>

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
                                <Breadcrumb.Item style={{fontSize: 22}}>

                                </Breadcrumb.Item>

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
                                            Order Management
                                        </div>

                                        <hr color="#F2F2F2"/>
                                        <br/>


                                        <Card>
                                            {orderList.map((e) => (
                                                <Card.Grid style={gridStyle} key={e.id}>
                                                    <Card
                                                        style={{width: 300}}
                                                        cover={
                                                            (e.orderStatus === 1 || e.orderStatus === 2) ?
                                                                <a style={{
                                                                    padding: 10,
                                                                    fontSize: 30,
                                                                    fontWeight: 100,
                                                                    color: "#acb7bb",
                                                                }}>Room</a> : <a style={{
                                                                    padding: 10,
                                                                    fontSize: 30,
                                                                    fontWeight: 100,
                                                                    color: "#0fa3d7",
                                                                }}>{e.roomNo}</a>

                                                        }
                                                        key={e.id}
                                                        actions={[
                                                            <Button
                                                                style={{
                                                                    backgroundColor: "#bdf390",
                                                                }}
                                                                disabled={(e.orderStatus === 3 || e.orderStatus === 4)}
                                                                onClick={() => {

                                                                    handleShow(e);
                                                                }}> check In</Button>,
                                                            <Button
                                                                disabled={(e.orderStatus === 1 || e.orderStatus === 2|| e.orderStatus === 4|| e.orderStatus === 5)}> Addition</Button>,
                                                            <Button
                                                                disabled={(e.orderStatus === 1 || e.orderStatus === 2|| e.orderStatus === 4|| e.orderStatus === 5)}
                                                                style={{
                                                                    backgroundColor: "#f58d79",
                                                                }} onClick={() => {
                                                                setSelectedOrder(e)
                                                                checkout();
                                                            }}> check Out</Button>,
                                                        ]}
                                                    >

                                                        <Meta
                                                            title={e.roomType}

                                                            description={e.customers.map((c) => (
                                                                <p>{c.fullName} - {c.phone}</p>
                                                            ))}
                                                        />

                                                        <h3>{timestampToDatetime(e.checkinDate) + " - " + timestampToDatetime(e.checkoutDate)}</h3>

                                                        <h2 style={{
                                                            padding: 10,
                                                            fontSize: 20,
                                                            fontWeight: 100,
                                                            color: "#1d51de",
                                                        }}> <span style={{
                                                            fontSize: 18,
                                                            color: "#737373"
                                                        }}>Status:</span> {orderStatusList.filter((function (o) {
                                                            return o.value === e.orderStatus
                                                        }))[0].name}</h2>

                                                        <table>
                                                            <tr>
                                                                <th>nameService</th>
                                                                <th>quantity</th>
                                                                <th>price</th>
                                                            </tr>
                                                            <tr>
                                                                <td><h4>{e.roomType}</h4></td>
                                                                <td>1</td>
                                                                <td>{(e.totalPrice - e.totalPriceService).toLocaleString('en-US', {
                                                                    style: 'currency',
                                                                    currency: 'VND'
                                                                })}</td>
                                                            </tr>
                                                            {e.services.map((s) => (
                                                                <tr>
                                                                    <td>{s.nameService}</td>
                                                                    <td>{s.quantity}</td>
                                                                    <td>{s.price.toLocaleString('en-US', {
                                                                        style: 'currency',
                                                                        currency: 'VND'
                                                                    })}</td>
                                                                </tr>
                                                            ))}

                                                            <tr>
                                                                <td><h3>Total Price</h3></td>
                                                                <td></td>
                                                                <td>{e.totalPrice.toLocaleString('en-US', {
                                                                    style: 'currency',
                                                                    currency: 'VND'
                                                                })}</td>
                                                            </tr>
                                                        </table>
                                                    </Card>
                                                </Card.Grid>
                                            ))}
                                        </Card>
                                        <br/>
                                    </div>
                                </div>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        </div>
    );
}

function datetimeToTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
}

function getdatetimenow() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth()+1 ) + '-' + today.getDate() ;
    var time = (today.getHours()) + ":" + today.getMinutes()  + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    return dateTime;
}

function checkindate(unixtimestamp) {
    var dt = eval(unixtimestamp * 1000);
    var myDate = new Date(dt);
    myDate.toLocaleString();
    return myDate.toLocaleString();
}

function checkoutdate(unixtimestamp) {
    var dt = eval(unixtimestamp * 1000);
    var myDate = new Date(dt);
    myDate.toLocaleString();
    return myDate.toLocaleString();
}

function timestampToDatetime(unixtimestamp) {
    var dt = eval(unixtimestamp * 1000);
    var myDate = new Date(dt);
    myDate.toLocaleString();
    dateFormat(myDate, "dd/mm/yyyy");
    return dateFormat(myDate, "dd/mm/yyyy");
}
