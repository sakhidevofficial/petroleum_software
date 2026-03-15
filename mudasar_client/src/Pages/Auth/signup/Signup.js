import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Container, Typography } from "@mui/material";
import Navbar from "../../../Components/navbar/Navbar";
import "./signup.scss";
import SignupForm from "./SignupForm";
import Subscriptions from "./subscriptions/Subscriptions";
import React, { useState, useEffect, useContext } from "react";
import Alert from "../../../Components/alert/Alert";
import { useDispatch, useSelector } from "react-redux";
import { getPackages, clearPackages } from "../../../redux/webAdmin/packagesSlice/packageSlice";
import AuthContext from "../../../context/auth/AuthContext";
import setAlert from "../../../redux/alertSlice/setAlert"

const SignUp = () => {

  //The use State hook and state used for holding values of textfield which includes
  const [state, setState] = useState({
    name: "",
    username: "",
    companyName: "",
    access: "web_admin",
    email: "",
    contact: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <div className="signup">
      <Navbar />
      <Alert />
      {/* This is Navbar component which is created with Header component*/}

      <Container className="signupContainer" style={{ marginTop: 20, paddingBottom: 0 }} component="main" maxWidth="md">

        <Container maxWidth="sm" style={{ marginTop: 20 }}>

          <SignupForm state={state} setState={setState} />
        </Container>


        {/* This code is used for making the footer of app*/}
        <Box mt={3}>
          <Typography
            className="copyrightText"
            variant="body2"
            color="textSecondary"
            align="center"
          >
            Copyright © SaimonSoft {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default SignUp;
