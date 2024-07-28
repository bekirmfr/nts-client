import { jwtDecode } from "jwt-decode";
import React from 'react';
///import dotenv from 'dotenv';
//dotenv.config();
class AuthService {
    static #Context = null

    // Method to access the immutable variable
    static get Context() {
        return AuthService.#Context;
    }
;
    constructor(domain) {
        this.domain = domain || 'https://localhost:3000'; //process.env.DOMAIN
        this.fetch = this.fetch.bind(this);
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
        if (this.constructor.Context == null) {
            AuthService.#Context = Object.freeze(React.createContext(this));
            Object.freeze(AuthService.Context);
        } else {
            console.log(new Error('Duplicate Auth Service! Deleting this.'))
            return;
        }
    }

    login(username, password) {
        // Get a token
        return this.fetch(`${this.domain}/login`, {
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

    getSubscription() {
        return this.fetch(`${this.domain}/subscription/get`, {
            method: 'POST'
        }).then(res => {
            console.log('getSubscription res: ', res);
            return Promise.resolve(res);
        }) 
    }
    getStrategies() {
        return new Promise((resolve, reject) => {
            this.fetch(`${this.domain}/strategy/list`, {
                method: 'POST'
            })
                .then(res => {
                    const { error, data } = res;
                    if (error) {
                        return reject(error);
                    }
                    console.log('getStrategies res: ', data);
                    return resolve(data);
                });
        });
    }

    viewStrategy(id) {
        return new Promise((resolve, reject) => {
            this.fetch(`${this.domain}/strategy/view/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    id
                })
            })
                .then(res => {
                    const { error, data } = res;
                    if (error) {
                        return reject(error);
                    }
                    console.log('getStrategies res: ', data);
                    return resolve(data);
                });
        });
    }

    editStrategy(id) {
        return new Promise((resolve, reject) => {
            this.fetch(`${this.domain}/strategy/edit/${id}`, {
                method: 'POST',
                body: JSON.stringify({ id })
            })
                .then(res => {
                    const { error, data } = res;
                    if (error) {
                        console.log('editStrategy res: ', data);
                        reject(error);
                    }
                    console.log('editStrategy res: ', data);
                    resolve(data);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        })
    }

    connectStrategy(id) {
        return new Promise((resolve, reject) => {
            this.fetch(`${this.domain}/strategy/edit/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    id
                })
            })
                .then(res => {
                    const { error, data } = res;
                    if (error) {
                        console.log('editStrategy res: ', data);
                        return reject(error);
                    }
                    console.log('editStrategy res: ', data);
                    return resolve(data);
                });
        });
    }

    async deploy(data) {
        return this.fetch(`${this.domain}/strategy/create`, {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(res => {
            console.log('deploy flow form data result: ', res);
            return Promise.resolve(res);
        })
    }


    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}

export default AuthService;