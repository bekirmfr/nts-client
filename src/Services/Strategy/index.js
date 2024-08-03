import BaseService from '../BaseService';

class StrategyService {
    context = null;
    constructor(serviceContainer) {
        if (this.constructor.instance) {
            return this.constructor.instance;
        }
        this.context = serviceContainer;
        this.constructor.instance = this;
    }

    start(id) {
        return new Promise((resolve, reject) => {
            this.context.fetch(`/strategy/start/${id}`, {
                method: 'POST'
            })
                .then(({ data }) => {
                    console.log('Start strategy data: ', data);
                    resolve(data);
                })
                .catch(error => reject(error));
        });
    }
    tick(id) {
        return new Promise((resolve, reject) => {
            this.context.fetch(`/strategy/tick/${id}`, {
                method: 'POST'
            })
                .then(({ data }) => {
                    console.log('Tick strategy res: ', data);
                    resolve(data);
                })
                .catch(error => reject(error));
        });
    }
    stop(id) {
        return new Promise((resolve, reject) => {
            this.context.fetch(`/strategy/stop/${id}`, {
                method: 'POST'
            })
                .then(({ data }) => {
                    console.log('Stop strategy res: ', data);
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    }

    list() {
        return new Promise((resolve, reject) => {
            this.context.fetch(`/strategy/list`, {
                method: 'POST'
            })
                .then(({ data }) => {
                    console.log('list data: ', data);
                    resolve(data);
                })
                .catch(error => reject(error));
        });
    }

    view(id) {
        return new Promise((resolve, reject) => {
            this.context.fetch(`/strategy/view/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    id
                })
            })
                .then(({ data }) => {
                    try {
                        const parsedFlow = JSON.parse(data.flow);
                        console.log('Strategy Service -> View -> parsedFlow: ', parsedFlow);
                        if (!(typeof parsedFlow == 'object' &&
                            typeof parsedFlow != 'array' &&
                            parsedFlow.hasOwnProperty('nodes') &&
                            parsedFlow.hasOwnProperty('edges') &&
                            parsedFlow.hasOwnProperty('viewport'))) {
                            console.log('typeof parsedFlow: ', typeof parsedFlow);
                            reject(new Error('Invalid flow.'));
                            return;
                        }
                    } catch (e) {
                        reject(new Error('Unable to parse flow.'));
                        return;
                    }
                    
                    console.log('viewStrategy data: ', data);
                    resolve(data);
                })
                .catch(error => {
                    console.log('viewStrategy fetch error: ', error);
                    reject(error);
                });
        });
    }

    edit(id, flow) {
        return new Promise((resolve, reject) => {
            this.context.fetch(`/strategy/edit/${id}`, {
                method: 'POST',
                body: JSON.stringify({id, flow})
            })
                .then(({ data }) => {
                    console.log('editStrategy data: ', data);
                    resolve(data);
            })
                .catch(error => {
                    console.log('editStrategy fetch error: ', error);
                    reject(error);
                });
        });
    }

    connect(id) {
        return new Promise((resolve, reject) => {
            this.context.fetch(`/strategy/edit/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    id
                })
            })
                .then(({ data }) => {
                    console.log('editStrategy res: ', data);
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    }

    async deploy(data) {
        return new Promise((resolve, reject) => {
            this.context.fetch(`/strategy/create`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
                .then(({ data }) => {
                    console.log('deploy flow form data result: ', data);
                    return resolve(data);
                    })
                .catch(error => reject(error));
        });
    }
}



export default StrategyService;
