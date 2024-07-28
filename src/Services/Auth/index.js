import { jwtDecode } from "jwt-decode";
///import dotenv from 'dotenv';
//dotenv.config();
class AuthService {
    context = null;

    constructor(serviceContainer) {
        if (this.constructor.instance) {
            return this.constructor.instance;
        }
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.context = serviceContainer;
        this.constructor.instance = this;
    }

    login(username, password) {
        // Get a token
        return this.context.fetch(`/login`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => {
            this.setToken(res.token)
            return Promise.resolve(res);
        })
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token); // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    isAdmin() {
        return this.getToken() && this.getProfile().isAdmin === 'TRUE';
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken)
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    getProfile() {
        console.log('token: ', this.getToken());
        return jwtDecode(this.getToken());
    }
}

export default AuthService;