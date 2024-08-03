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
        }).then(({ token }) => {
            console.log('login res: ', token);
            this.setToken(token)
            return Promise.resolve(token);
        })
            .catch((error)=> Promise.reject(error));
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
            return true;
        }
    }

    isAdmin() {
        return !this.isTokenExpired(this.getToken()) && this.getProfile() && this.getProfile().isAdmin === 'TRUE';
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken)
    }

    getToken() {
        // Retrieves the user token from localStorage
        var token = localStorage.getItem('id_token');
        if (!token) return null;
        return token;
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    getProfile() {
        var token = this.getToken()
        console.log('token: ', token);
        if (!token) return null;
        try {
           var profile =  jwtDecode(this.getToken());
        } catch (e) {
            console.log(e);
            return null;
        }
        return profile
    }
}

export default AuthService;