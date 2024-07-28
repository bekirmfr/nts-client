import React, { Component } from 'react';
import Services from 'Services';

const Auth = new AuthService('http://localhost:3000');

function withAuth(AuthComponent) {
    
    return class AuthWrapped extends Component {

        constructor() {
            super();
            this.state = {
                user: null
            }
        }
        componentWillMount() {
            if (!Auth.loggedIn()) {
                this.props.history.replace('/app/auth/');
            }
        }
        componentDidMount() {
            try {
                const profile = Auth.getProfile();
                this.setState({
                    user: profile
                });
            }
            catch (err) {
                console.log(err);
                Auth.logout();
                this.props.history.replace('/app/auth');
            }
        }

        render() {
            
            return (
                <AuthComponent history={this.props.history} user={this.state.user} auth={Auth} />
            );
        }
    };
}

export default withAuth;