import React, { Component } from 'react';
//import AuthService from './AuthService.js';
import Services from 'Services';

//const Auth = new AuthService('http://localhost:3000');

function withAuth(AuthComponent) {
    
    return class AuthWrapped extends Component {

        constructor() {
            super();
            this.state = {
                user: null
            }
        }
        componentWillMount() {
            console.log('Services.Auth.loggedIn(): ', Services.auth.loggedIn());
            if (!Services.auth.loggedIn()) {
                
                this.props.history.replace('/app/auth/');
            }
        }

        render() {
            
            return (
                <AuthComponent history={this.props.history} />
            );
        }
    };
}

export default withAuth;