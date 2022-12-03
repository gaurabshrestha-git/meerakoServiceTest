import React, { useEffect, useState } from "react";
import axios from "axios";

import { Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [productDetails, setProductDetails] = useState();
  const navigate = useNavigate();

  const handleOnClickScrap = async () => {
    await axios
      .get("https://meerako.herokuapp.com/getData")
      .then((response) => {
        setProductDetails(response.data.data);
        console.log(response.data.data);
      });
  };

  const handleOnClickSubmit = async () => {
    axios
      .post("https://meerako.herokuapp.com/insertData", {
        productDetails,
        userId: localStorage.getItem("userId"),
      })
      .then((response) => {
        if (response.data.submitted === true) {
          alert("Submitted Successfully");
        }
      });
  };

  useEffect(() => {
    axios
      .post("https://meerako.herokuapp.com/verifyToken", {
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
      <h3>Dashboard</h3>
      <Button onClick={handleOnClickScrap}>Scrap Data</Button>
      {productDetails && (
        <>
          <Button onClick={handleOnClickSubmit}>Submit Data</Button>
        </>
      )}
      <div>
        {productDetails &&
          productDetails.map((data, index) => {
            return (
              <div key={index}>
                <div>
                  Name: {data.productName} | Price: {data.price}
                </div>
                <div></div>
              </div>
            );
          })}
      </div>
    </Container>
  );
};

export default Dashboard;
