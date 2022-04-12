import React, { useEffect, useState } from "react";
import {Route} from "react-router-dom";

import {
    Button,
    Input,
    Breadcrumb,
    Layout,
    Modal,
    Form,
    message,
    Table,
    Popconfirm, Select, DatePicker, InputNumber, Space,
} from "antd";
import "antd/dist/antd.css";
import "./style.css";
import { delAuth, getAuth, postAuth, putAuth } from "../../Util/httpHelper";
import {
    PlusSquareOutlined,
    DeleteFilled,
    EditFilled, MinusCircleOutlined, PlusOutlined,
} from "@ant-design/icons";
import {getHotel, setBookingId} from "../../Util/Auth";
import FormControl from "@mui/material/FormControl";
import TextArea from "antd/es/input/TextArea";
import OrderList from "./order-list";
const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
function ListBooking(props) {
    const bookingStatusList = [{value: 1, name: "Request"},
        {value: 2, name: "Confirmed"},
        {value: 3, name: "Canceled"},];
    const [bookingList, setBookingList] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [idBookingStatus, setIdBookingStatus] = useState("1");
    const [idCategory, setIdCategory] = useState("");

    const [listRoomType, setListRoomtype] = useState([]);
    const [roomType, setRoomtype] = useState(1);
    const [guestName, setGuestName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [CheckInDate, setCheckInDate] = useState("");
    const [CheckOutDate, setCheckOutDate] = useState("");
    const [adultAmount, setAdultAmount] = useState("");
    const [childAmount, setChildAmount] = useState("");
    const [roomQuantity, setRoomQuantity] = useState("");
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



    useEffect(() => {
        getListbooking(currentPage);
        getRoomtype();
    }, []);

    // update form update when selectedCAtegory change

    async function getRoomtype() {
        getAuth(`/hotels/${chosen}/room-types`).then((response) => {
            let map = new Map();
            if (response.status === 200) {
                response.data.data.map((e) => {
                    map.set(e.id, e);
                });
                setListRoomtype([...map.values()]);
            }
        }); }
    //load data
    async function getListbooking(page) {
        console.log("Current: ", page);
        await getAuth(`/bookings?hotel-id=${chosen}&booking-status=${idBookingStatus}&customer=${keyword}&status=true&page-index=${1}`).then(
            (response) => {
                let map = new Map();
                if (response.status === 200) {
                    response.data.data.data.map((e) => {
                         for(let i=0; i<bookingStatusList.length; i++) {
                            console.log(e.bookingStatus);
                            if( e.bookingStatus== bookingStatusList[i].value){
                                e.bookingStatus=bookingStatusList[i].name
                            }
                        }


                        console.log(e);
                        //let newObj = getOrder(e);
                        //console.log(newObj);
                        map.set(e.id, e);

                    });
                    console.log(map);
                    setCurrentPage( response.data.pageIndex)
                    setBookingList([...map.values()]);
                }
            }
        );
    }
    //search
    async function getOrder(values){

        await getAuth(`/orders?hotel-id=${chosen}&booking-id=${values.id}` )
            .then((response)=>{
                if (response.status === 201) {

                    let newObj = Object.assign(values, { checkInDate: response.data.data.dataIndex[0]?.checkinDate ,
                        checkOutDate: response.data.data.dataIndex[0]?.checkoutDate});
                    console.log(newObj);
                    return newObj;
                    //message.success("Input Successfully");
                    //setIsModalVisible(false);
                    //getListCate(currentPage);

                }
            })
    };

    //add category
    async  function addBooking(values){

        postAuth(`/bookings`, {
            hotelId: chosen,
            roomQuantity: values.roomQuantity,
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

                    setIsModalVisible(false);
                    getListbooking(currentPage);
                    formAdd.resetFields();
                }
            })
    };

    async function addOrder(values, bookingDetails){

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


    //confirm booking

    const changeStatusBooking = (values,status) => {
        putAuth(`/bookings/${values}/update-status/${status}`).then((response) => {
            if (response.status === 200) {
                message.success("Update Successfully");
                setIsModalUpdateVisible(false);
                getListbooking(currentPage);
            }
        });
    };

    //delete category

    const column = [
        {
            title: "No",
            key: "id",
            render: (e, item, index) => {
                return <>{index + 1}</>;
            },
        },
        {
            title: "Customer Name",
            key: "customer",
            dataIndex: "customer",
        },

        {
            title: "Quantity",
            key: "roomQuantity",
            dataIndex: "roomQuantity",
        },
        {
            title: "note",
            key: "note",
            dataIndex: "note",
        },
        {
            title: "Status",
            key: "bookingStatus",
            dataIndex: "bookingStatus",
        },
        {
            title: "Action",
            render: (e, item) => {
                return (
                    <>
                        <Button
                            href="manager/order"
                            id={item.id}
                            type="primary"
                            style={{
                                borderRadius: 3,
                                marginLeft: 10,
                                height: 45,
                                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#11cdef",
                                borderColor: "#11cdef",
                            }}
                            onClick={() => { setBookingId(item.id); }

                            }
                        >View
                            <EditFilled />
                        </Button>
                        <Button
                            id={item.id}
                            type="primary"
                            style={{
                                borderRadius: 3,
                                marginLeft: 10,
                                height: 45,
                                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#68c92f",
                                borderColor: "#68c92f",
                            }}
                            onClick={() => { changeStatusBooking(item.id,2); }

                            }
                        >Confirm
                            <EditFilled />
                        </Button>
                            <Button
                                type="danger"
                                style={{
                                    borderRadius: 3,
                                    height: 45,
                                    marginLeft: 10,
                                    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "#f5365c",
                                }} onClick={() => { changeStatusBooking(item.id,3); }

                            }
                            > Canceled
                                <DeleteFilled />
                            </Button>

                    </>
                );
            },
        },
    ];
    const gridStyle = {
        width: "25%",
        marginLeft: "6%",
        marginTop: "2%",
        textAlign: "center",
    };
    return (
        <div>
            <Modal
                style={{width:800}}
                title="Create Booking"
                visible={isModalVisible}
                onOk={addBooking}
                onCancel={handleCancel}
                footer={false}>
                <Form
                    name="basic"
                    form={formAdd}
                    onFinish={addBooking}
                    style={{width:420}}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 40,
                    }}
                    autoComplete="off"
                >
                    <div>Guest name</div>
                    <Form.Item
                        name="customer"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Guest Name!",
                            },
                        ]}
                    ><Input
                            placeholder="Guest name"
                            name="customer"
                            onChange={(e) => setGuestName(e.target.value)}
                            style={{
                                height: 50,
                                boxShadow:
                                    "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
                                borderRadius: 6,
                            }}
                        />
                    </Form.Item>
                    <div>Phone number</div>
                    <Form.Item
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Phone number!",
                            },
                        ]}
                    >
                        <Input type="number"  name="phone"  onChange={(e) => setPhoneNumber(e.target.value)}
                               style={{
                                   height: 50,
                                   boxShadow:
                                       "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
                                   borderRadius: 6,
                               }} />
                    </Form.Item>

                    <Form.Item >
                        <div>
                        <h4>Date Booking</h4>
                            <div>Check-in</div>
                        <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 10px)' }}
                            name="checkinDate">

                            <DatePicker name="checkinDate" onChange={(e) => setCheckInDate(e.target.value)}/>
                        </Form.Item>
                            <div>Check-out</div>
                        <Form.Item  name="checkoutDate" style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                             <DatePicker name="checkoutDate" onChange={(e) => setCheckOutDate(e.target.value)}/>
                        </Form.Item></div>
                    </Form.Item>

                    <Form.Item >
                    <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 10px)' }}
                        name="adultAmount" label={"No. Adult"}
                        rules={[
                            {
                                required: true,
                                message: "Missing Adult",
                            },
                        ]}
                    >
                        <InputNumber name="adultAmount" placeholder="adult Amount"
                                      onChange={(e) => setAdultAmount(e.target.value)}
                                      style={{
                                          height: 50,
                                          boxShadow:
                                              "0 7px 12px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
                                          borderRadius: 6,
                                      }}/>
                    </Form.Item>

                        <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 10px)' }}
                            name="childAmount" label={"No. Child"}
                            rules={[
                                {
                                    required: true,
                                    message: "Missing Child",
                                },
                            ]}
                        >
                            <InputNumber  name="childAmount" placeholder="child Amount"
                                          onChange={(e) => setChildAmount(e.target.value)}
                                          style={{
                                              height: 50,
                                              boxShadow:
                                                  "0 7px 14px rgb(50 50 93 / 10%)",
                                              borderRadius: 6,
                                          }}/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item >
                        <Form.Item  style={{ display: 'inline-block', width: 'calc(50% - 15px)' }}
                            name="roomQuantity" label={"Quantity"}
                            rules={[
                                {
                                    required: true,
                                    message: "Missing Quantity",
                                },
                            ]}
                        >
                            <InputNumber  name="roomQuantity" placeholder="room Quantity"
                                          onChange={(e) => setRoomQuantity(e.target.value)}
                                          style={{
                                              height: 50,
                                              boxShadow:
                                                  "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
                                              borderRadius: 6,
                                          }}/>
                        </Form.Item>

                    <Form.Item
                        name="note" label={"Note"}>
                        <TextArea name="note" style={{marginLeft: 10}} placeholder="Note" />
                    </Form.Item>
                    </Form.Item>
                    <Form.List name="bookingDetails">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key}>
                                        <Form.Item
                                            {...restField}
                                            label="Room type"
                                            name={[name, "roomTypeId"]}
                                        >
                                            <Select
                                                defaultValue={listRoomType[0].name}
                                                style={{ width: 130, marginLeft: 30, marginRight: 20 }}
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
                                            <InputNumber style={{marginLeft: 80}} placeholder="Quantity" />
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

                    <Form.Item
                        style={{ marginLeft: 30 }}
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
                            onClick={addBooking}
                        >
                            Save
                        </Button>
                    </Form.Item>
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
                            Booking Management
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
                                    Booking Management
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
                                    Create Booking
                                </Button>
                                <hr color="#F2F2F2" />
                                <br />
                                <div >
                                <FormControl sx={{ m: 1, width: 150 }}>
<div> Status </div>
                                    <Select
                                        placeholder="Select Booking Status..."
                                        onChange={setIdBookingStatus}
                                    >
                                        {bookingStatusList.map((status) => (
                                            <Option key={status.value} value={status.value}>
                                                {status.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Search
                                    placeholder="Input Customer name..."
                                    onSearch={getListbooking}
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
                            </div>

                                <Table columns={column} dataSource={bookingList} />
                                <br />
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>
        </div>
    );
}
function toTimestamp(strDate){ var datum = Date.parse(strDate); return datum/1000;}

export default ListBooking;
