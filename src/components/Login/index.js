import React, { useState } from "react";

import "antd/dist/antd.css";

import { Form, Input, Button, Checkbox} from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import {  postAuth } from "../../Util/httpHelper";
import { useHistory } from "react-router-dom";
import { setToken, setUser } from "../../Util/Auth";

function Login() {
  const history = useHistory();
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const email = useFormInput("");
  const password = useFormInput("");

  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    postAuth("/users/login", {
      email:email.value,
      password: password.value
    },
    )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setToken(response.data.data.token)
          setUser(email.value)
          history.push('/manager');
          
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setError("Invalid account");
        }
      });
  };
  return (
    <div
      style={{
        backgroundRepeat: "no-repeat",
        paddingTop: 200,
        backgroundImage: "linear-gradient( #7B68EE,#FFFFFF)",
        paddingBottom: 50,
      }}
    >
     
      
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 5,
          height: 600,
          width: 500,
          marginLeft: "37%",
          boxShadow:
            "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
        }}
      >
        <div style={{ marginLeft: "37%", fontSize: 20, paddingTop: 30 }}>
          Sign up with
        </div>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            borderColor: "#DC143C",

            height: 50,
            width: 140,
            borderRadius: 6,
            backgroundColor: "#DC143C",
            boxShadow:
              "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
            marginLeft: 170,
            marginTop: 30,
          }}
        >
          <GoogleOutlined style={{ fontSize: 20 }} /> Google
        </Button>
        <hr style={{ marginTop: 20 }} color="#F2F2F2" />
        <div
          className="site-layout-background"
          style={{
            padding: 24,

            borderRadius: 6,
            marginLeft: 50,
          }}
        >
          <Form
            name="basic"
            style={{ marginTop: 70 }}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div style={{ marginLeft: "15%", marginBottom: 50, fontSize: 20 }}>
              {" "}
              Or sign in with credentials
            </div>
            {error && (
              <>
                <small style={{ color: "red" }}>{error}</small>
                <br />
              </>
            )}

            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input
                placeholder="Email"
                name="email"
                {...email}
                style={{
                  height: 50,
                  width: 340,
                  boxShadow:
                    "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
                  borderRadius: 6,
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                placeholder="Password"
                name="password"
                {...password}
                style={{
                  height: 50,
                  width: 340,
                  boxShadow:
                    "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
                  borderRadius: 6,
                }}
                
              />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 0,
                span: 16,
              }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 6,
                span: 16,
              }}
            >
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
                onClick={handleLogin}
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

export default Login;
