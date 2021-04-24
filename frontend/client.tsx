import React from "react";
import { render } from "react-dom";

import App from "./layouts/App";

function client() {
  return <div></div>;
}

render(<App />, document.querySelector("#app"));
