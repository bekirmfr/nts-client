class SubscriptionService {
    context = null;
    constructor(serviceContainer) {
        if (this.constructor.instance) {
            return this.constructor.instance;
        }
        this.context = serviceContainer;
        //this.get = this.get.bind(this);
        this.constructor.instance = this;
    }

    get() {
        return new Promise((resolve, reject) => {
            this.context.fetch(`/subscription/get`, {
                method: 'POST'
            })
                .then(res => {
                    if (!res) reject({error: 'Ubale to fetch domain. Server is not responding.'})
                    const { error, data } = res;
                    if (error) {
                        console.log('SubscriptionService error: ', error);
                        reject(error);
                    }
                    console.log('SubscriptionService data: ', data);
                    resolve(data);
                });
        });
    }
}

export default SubscriptionService;
