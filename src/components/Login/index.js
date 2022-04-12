import React, { useState } from "react";

import "antd/dist/antd.css";

import { Form, Input, Button, Checkbox} from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { post } from "../../Util/httpHelper";
import { useHistory } from "react-router-dom";
import { setToken, setUser, setUserJWT } from "../../Util/Auth";
import jwtDecode from "jwt-decode";
import {User} from "./user.js";

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
    post("/users/login", {
      email:email.value,
      password: password.value
    },
    )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setToken(response.data.data.token)

          //decode JWT Token
          var token = jwtDecode(response.data.data.token)

          //parse and set user to session storage
          let userJWT = new User(token.id, token.email, token.name, token.role, token.exp)
          setUserJWT(userJWT)

          setUser(email.value)
          history.push('/home');

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
          height: 500,
          width: 450,
          marginLeft: "35%",
          boxShadow:
            "0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%)",
        }}
      >

         <hr style={{ marginTop: 20 ,textAlign:"center"}} color="#F2F2F2" />
        <div
          className="site-layout-background"
          style={{
            padding: 20,

            borderRadius: 6,
            marginLeft: 30,
          }}
        >
          <Form
            name="basic"
            style={{ marginTop: 30 }}
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
              <div
                  style={{
                      padding: 12,
                      fontStyle: "inherit",
                      fontSize: 50,
                      fontWeight: 600,
                      lineHeight: 1.5,
                      color: "#32325d",
                  }}
              >
                  Login
              </div>
            {error && (
              <>
                <small style={{ color: "red" }}>{error}</small>
                <br />
              </>
            )}
              <br />
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
