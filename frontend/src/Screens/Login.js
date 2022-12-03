import axios from "axios";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Container, Form } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const handleOnClickSubmit = async () => {
    await axios
      .post("http://localhost:5000/loginUser", {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data.login === false) {
          alert("Email or Password do not match");
        } else {
          console.log(response);

          localStorage.setItem("userId", response.data._id);
          localStorage.setItem("token", response.data.token);
          navigate("/dashboard");
        }
      });
  };

  useEffect(() => {
    axios
      .post("http://localhost:5000/verifyToken", {
        token: localStorage.getItem("token"),
      })
      .then((response) => {
        if (response.data.login === false) {
          navigate("/");
        } else {
          navigate("/dashboard");
        }
      });
  }, []);
  return (
    <Container>
      <h4>Login Screen</h4>
      <Form className="py-4">
        <Form.Group>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          ></Form.Control>
        </Form.Group>
      </Form>

      <button onClick={handleOnClickSubmit}>submit</button>
    </Container>
  );
};

export default Login;
