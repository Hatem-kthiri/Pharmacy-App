import React from "react";
import PrivateRoute from "./route/PrivateRoute";
import Layout from "./layout/Index";

import Error404Classic from "./Other/pages/error/404-classic";
import Error404Modern from "./Other/pages/error/404-modern";
import Error504Modern from "./Other/pages/error/504-modern";
import Error504Classic from "./Other/pages/error/504-classic";

import Login from "./Pages/Login/Login";
import Register from "./Other/pages/auth/Register";
import ForgotPassword from "./Other/pages/auth/ForgotPassword";
import Success from "./Other/pages/auth/Success";

import { Switch, Route, withRouter } from "react-router-dom";
import { RedirectAs404 } from "./utils/Utils";

const App = () => {
  return (
    <Switch>
      {/* Auth Pages */}
      <Route exact path={`${process.env.PUBLIC_URL}/auth-success`} component={Success}></Route>
      <Route exact path={`${process.env.PUBLIC_URL}/auth-reset`} component={ForgotPassword}></Route>
      <Route exact path={`${process.env.PUBLIC_URL}/auth-register`} component={Register}></Route>
      <Route exact path={`${process.env.PUBLIC_URL}/auth-login`} component={Login}></Route>

      {/*Error Pages*/}
      <Route exact path={`${process.env.PUBLIC_URL}/errors/404-classic`} component={Error404Classic}></Route>
      <Route exact path={`${process.env.PUBLIC_URL}/errors/504-modern`} component={Error504Modern}></Route>
      <Route exact path={`${process.env.PUBLIC_URL}/errors/404-modern`} component={Error404Modern}></Route>
      <Route exact path={`${process.env.PUBLIC_URL}/errors/504-classic`} component={Error504Classic}></Route>

      {/*Main Routes*/}
      <PrivateRoute exact path="" component={Layout}></PrivateRoute>
      <Route component={RedirectAs404}></Route>
    </Switch>
  );
};
export default withRouter(App);