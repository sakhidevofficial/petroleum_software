import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../../Pages/Auth/login/Login";
import Signup from "../../Pages/Auth/signup/Signup";
import "../../style/dark.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alert from "../../Components/alert/Alert";
const UnAuthApp = ({ mode }) => {
  return (
    <div className={mode === "dark" ? "unAuthApp dark" : "unAuthApp"}>
      <ToastContainer theme="colored" closeButton={false} />
      <Alert />
      <BrowserRouter>
        <div className="appContainer">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default UnAuthApp;
