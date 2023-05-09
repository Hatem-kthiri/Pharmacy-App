import React, { Suspense, useLayoutEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { RedirectAs404 } from "../utils/Utils";

import Invest from "../Other/pages/Invest";
import UserList from "../Pages/Admin/ManagePharmacy/UserList";
import ProviderList from "../Pages/Admin/ManageProvider/ProviderList";
import RedirectRoute from "./RedirectRoute";
import jwt_decode from "jwt-decode";

const Pages = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });
  let auth = localStorage.getItem("accessToken");
  let { role } = jwt_decode(auth);

  return (
    <Suspense fallback={<div />}>
      <Switch>
        <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/admin/provider-user`}
          role="admin"
          userRole={role}
          component={ProviderList}
        />
        <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/admin/pharmacy-user`}
          role="admin"
          userRole={role}
          component={UserList}
        />
        <RedirectRoute exact path={`${process.env.PUBLIC_URL}/admin`} role="admin" userRole={role} component={Invest} />
        <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/pharmacy`}
          role="pharmacy"
          userRole={role}
          component={Invest}
        />
        <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/pharmacy`}
          role="provider"
          userRole={role}
          component={Invest}
        />
        <Route component={RedirectAs404}></Route>
      </Switch>
    </Suspense>
  );
};
export default Pages;
