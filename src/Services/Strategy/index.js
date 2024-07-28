import BaseService from '../BaseService';

class StrategyService {
    context = null;
    constructor(serviceContainer) {
        if (this.constructor.instance) {
            return this.constructor.instance;
        }
        this.context = serviceContainer;
        this.getAll = this.getAll.bind(this);
        this.constructor.instance = this;
    }

    start(id) {
        return new Promise((resolve, reject) => {
            this.context.fetch(`/strategy/start/${id}`, {
                method: 'POST'
            })
                .then(res => {
                    const { error, data } = res;
                    if (error) {
                        return reject(error);
                    }
                    console.log('start Strategy res: ', data);
                    return resolve(data);
                });
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.context.fetch(`/strategy/list`, {
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
            this.context.fetch(`/strategy/view/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    id
                })
            })
                .then(res => {
                    const { error, data } = res;
                    if (error) {
                        reject(error);
                        return;
                    }
                    console.log('getStrategies res: ', data);
                    resolve(data);
                });
        });
    }

    editStrategy(id) {
        return new Promise((resolve, reject) => {
            this.context.fetch(`/strategy/edit/${id}`, {
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

    connectStrategy(id) {
        return new Promise((resolve, reject) => {
            this.context.fetch(`/strategy/edit/${id}`, {
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
        return this.context.fetch(`/strategy/create`, {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(res => {
            console.log('deploy flow form data result: ', res);
            return Promise.resolve(res);
        })
    }
}



export default StrategyService;
