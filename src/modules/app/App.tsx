import React from "react";
import Login from "../login/Login";
import { Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "../../contexts/AuthContext";
import Dashboard from "../dashboard/Dashboard";
import PrivateRoute from "./PrivateRoutes";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory();

function App() {
  return (
    <>
      <Router history={history}>
        <AuthProvider>
          <Switch>
            <PrivateRoute path="/th_cms/dashboard" component={Dashboard} />
            <Route exact path="/th_cms/" component={Login} />
          </Switch>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
