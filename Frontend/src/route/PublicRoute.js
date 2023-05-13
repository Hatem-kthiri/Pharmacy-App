import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const isLogin = () => {
    if (localStorage.getItem("accessToken")) {
      return true;
    }
    return false;
  };
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() && restricted ? <Redirect to={`${process.env.PUBLIC_URL}/admin`} /> : <Component {...props} />
      }
    />
  );
};

export default PublicRoute;
