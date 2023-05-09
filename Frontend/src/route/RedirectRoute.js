import React from "react";
import { Route, Redirect } from "react-router-dom";

const RedirectRoute = ({ component: Component, role, userRole, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      role === userRole ? <Component {...props} /> : <Redirect to={`${process.env.PUBLIC_URL}/${userRole}`} />
    }
  />
);

export default RedirectRoute;
