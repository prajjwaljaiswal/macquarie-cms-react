import React from "react";
import { useSelector } from "react-redux";
import { loginSelector } from "../login/loginSlice";
import { Route, Redirect } from "react-router-dom";

export default function PrivateRoute({ component: Component, ...rest }: any) {
  const { token } = useSelector(loginSelector);

  return (
    <Route
      {...rest}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to="/th_cms/" />
      }
    />
  );
}
