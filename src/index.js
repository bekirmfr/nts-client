import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "views/LandingPage/Home.js";
import Features from "views/LandingPage/Features.js";
import App from "./App.js";

const root = createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
    <Switch>
      <Route path={`/home`} component={Home} />
      <Route path={`/features`} component={Features} />
      <Route path={`/app`} component={App} />
      <Redirect from='/' to='/home'/>
    </Switch>
        </BrowserRouter>,
  document.getElementById("root")
);
