import React, { Suspense, useLayoutEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { RedirectAs404 } from "../utils/Utils";

import Invest from "../Other/pages/Invest";
import UserList from "../Pages/Admin/ManagePharmacy/UserList";
import ProviderList from "../Pages/Admin/ManageProvider/ProviderList";
import OrdersList from "../Pages/Admin/OrderList/OrderList";
import RedirectRoute from "./RedirectRoute";
import jwt_decode from "jwt-decode";
import ProductList from "../Pages/Provider/Products/ProductList";
import Orders from "../Pages/Provider/Orders/OrdersList";
import ManageStock from "../Pages/Pharmacy/ManageStock/ManageStock";
import ProvidersShop from "../Pages/Pharmacy/ProvidersShop/ProvidersShop";
import MyOrders from "../Pages/Pharmacy/MyOrders/MyOrders";
import UserProfile from "../Pages/UserProfile/UserProfile";

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
          path={`${process.env.PUBLIC_URL}/admin`}
          role="admin"
          userRole={role}
          component={UserList}
        />
        <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/admin/orders`}
          role="admin"
          userRole={role}
          component={OrdersList}
        />
        {/* <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/pharmacy`}
          role="pharmacy"
          userRole={role}
          component={Invest} 
        /> */}
        <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/pharmacy`}
          role="pharmacy"
          userRole={role}
          component={ManageStock}
        />
        <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/pharmacy/provider`}
          role="pharmacy"
          userRole={role}
          component={ProvidersShop}
        />
        <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/pharmacy/my-orders`}
          role="pharmacy"
          userRole={role}
          component={MyOrders}
        />
        <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/pharmacy/provider`}
          role="pharmacy"
          userRole={role}
          component={ProvidersShop}
        />

        <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/provider`}
          role="provider"
          userRole={role}
          component={ProductList}
        />
        <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/provider/orders`}
          role="provider"
          userRole={role}
          component={Orders}
        />
        <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/provider/profile`}
          role="provider"
          userRole={role}
          component={UserProfile}
        />
        <RedirectRoute
          exact
          path={`${process.env.PUBLIC_URL}/pharmacy/profile`}
          role="pharmacy"
          userRole={role}
          component={UserProfile}
        />

        <Route component={RedirectAs404}></Route>
      </Switch>
    </Suspense>
  );
};
export default Pages;
