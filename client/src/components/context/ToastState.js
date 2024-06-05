import React from "react";
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastContext from "./ToastContext";
import { Toaster } from "react-hot-toast";
const ToastState = ({ children }) => {
  return (
    <ToastContext.Provider>
      {children}
      <Toaster/>
    </ToastContext.Provider>
  );
};

export default ToastState;
