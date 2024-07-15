import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import withAuth from 'components/Auth/withAuth.js';
import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import UserLayout from "layouts/User.js";

class App extends Component {
    Auth = this.props.auth;
    
    render() {
        console.log('this.Auth.isAdmin(): ', this.Auth.isAdmin());
        return (
            <BrowserRouter>
                <Switch>
                    {this.Auth.isAdmin() ? (
                        <Route path={`/app/admin`} component={AdminLayout} />
                    ) : null}
                    <Route path={`/app/user`} component={UserLayout} />
                    <Route path={`/app/auth`} component={AuthLayout} />
                    <Redirect from='/app' to='/app/user' />
                    
                </Switch>
                </BrowserRouter>
        );
    }
}

export default withAuth(App);
