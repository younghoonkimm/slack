import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import loadable from "@loadable/component";

const Login = loadable(() => import("@pages/Login"));
const Sign = loadable(() => import("@pages/Sign"));
const Channel = loadable(() => import("@pages/Channel"));

function App() {
  return (
    <Switch>
      <Redirect exact path="/" to="/login/" />
      <Route path="/login" component={Login} />
      <Route path="/sign" component={Sign} />
      <Route path="/workspace/channel" component={Channel} />
    </Switch>
  );
}

export default App;
