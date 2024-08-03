import StrategyService from './Strategy';
import SubscriptionService from './Subscription';
import AuthService from './Auth';

class Services {
    domain = 'http://localhost:3000';
    
    auth = null;
    subscription = null;
    strategy = null;
    constructor() {
        if (Services.instance) {
            return Services.instance;
        }
        
        this.strategy = new StrategyService(this);
        //Object.freeze(this.strategy);
        this.subscription = new SubscriptionService(this);
        //Object.freeze(this.subscription);
        this.auth = new AuthService(this);
        //Object.freeze(this.auth);
        this.fetch = this.fetch.bind(this);
        Services.instance = this;
    }

    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if (this.auth.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.auth.getToken()
        }

        return fetch(this.domain + url, {
            headers,
            ...options
        })
            .then(this.#_checkStatus)
            .catch(error => {throw error; });
    }

    #_checkStatus(response) {
        if (response == null || response == undefined) {
            throw new Error('Invalid response.');
        }
        if (!response.ok) {
            return response.text().then(raw => { throw new Error(JSON.parse(raw).error) })
        }
        else {
            return response.json();
        }
    }
}

export default new Services();