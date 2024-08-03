import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Services from 'Services';
import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import UserLayout from "layouts/User.js";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    {Services.auth.isAdmin() && (
                        <Route path={`/app/admin`} component={AdminLayout} />
                    )}
                    <Route path={`/app/user`} component={UserLayout} />
                    <Route path={`/app/auth`} component={AuthLayout} />
                    {Services.auth.loggedIn() ? (
                        <Redirect from='/app' to='/app/user' />
                    ) : (
                        <Redirect from='/app' to='/app/auth' />
                    )}
                    
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
