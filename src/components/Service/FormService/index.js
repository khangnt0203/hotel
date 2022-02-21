import React, { useState } from "react";

import "antd/dist/antd.css";
import { Form, Input, Button, Breadcrumb } from "antd";


const FormService = () => {
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState("optional");

  const onRequiredTypeChange = ({ requiredMarkValue }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  return (
    <div>
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
        <Breadcrumb.Item>
          Add Service
        </Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          backgroundColor: "white",
          maxWidth: "auto",
          marginLeft: 70,
          marginRight: 20,
          top: -200,
          position: "relative",
          zIndex: 2,
          borderRadius: 5,
        }}
      >
        <div
          style={{
            padding: 20,
            fontStyle: "inherit",
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1.5,
            color: "#32325d",
          }}
        >
          Add Building
        </div>
        <hr color="#F2F2F2" />
        <br />

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            requiredMarkValue: requiredMark,
          }}
          onValuesChange={onRequiredTypeChange}
        >
          <Form.Item style={{ marginLeft: 30, float: "left", marginRight: 30 }}>
            <div style={{ fontSize: 15, marginBottom: 10 }}>Building Name</div>
            <Input
              placeholder="input placeholder"
              style={{ height: 45, width: 700, borderRadius: 6 }}
            />
          </Form.Item>
          <Form.Item style={{ marginLeft: 30 }}>
            <div style={{ fontSize: 15, marginBottom: 10 }}>Total Room</div>
            <Input
              placeholder="input placeholder"
              style={{
                height: 45,
                width: 700,
                borderRadius: 6,
                marginBottom: 50,
              }}
            />
          </Form.Item>
          <Form.Item style={{ marginLeft: 30 }}>
            <div style={{ fontSize: 15, marginBottom: 10 }}>Total Floor</div>
            <Input
              placeholder="input placeholder"
              style={{
                height: 45,
                width: 700,
                borderRadius: 6,
                marginBottom: 50,
              }}
            />
          </Form.Item>
          <Form.Item style={{ marginLeft: 30 }}>
            <Button
              style={{
                height: 45,
                width: 150,
                borderRadius: 6,
                backgroundColor: "#6A5ACD",
                marginBottom: 50,
              }}
            >
              Submit Form
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default FormService;
