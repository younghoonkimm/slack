import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import loadable from "@loadable/component";

const Login = loadable(() => import("@pages/Login"));
const Sign = loadable(() => import("@pages/Sign"));
const WorkSpace = loadable(() => import("@layouts/WorkSpace"));

function App() {
  return (
    <Switch>
      <Redirect exact path="/" to="/login/" />
      <Route path="/login" component={Login} />
      <Route path="/sign" component={Sign} />
      <Route path="/workspace" component={WorkSpace} />
    </Switch>
  );
}

export default App;
