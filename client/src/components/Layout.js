import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import toast, { Toaster } from 'react-hot-toast';
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />

        {/* Meta tag for description */}
        <meta name="description" content="{description}" />

        {/* Meta tag for keywords */}
        <meta name="keywords" content="{keywords}" />

        {/* Meta tag for author */}
        <meta name="author" content="{author}" />

        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "70vh" }}>
        {/* <ToastContainer /> */}
        {/* <Toaster /> */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
