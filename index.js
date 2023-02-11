const axios = require("axios");
const api = require("./api.js");

module.exports = function (exponentialApiKey) {
    if (typeof exponentialApiKey !== 'string') { 
        throw 'Please pass a valid Exponential API key';
    }

    async function apiCall(projectHandle, httpMethod, path, config) {
        if ((typeof projectHandle !== 'string') || projectHandle.match(/^[a-z0-9](-?[a-z0-9])*$/) === null) {
            throw 'Invalid project handle';
        }
        if ((typeof path !== 'string') || !path.startsWith('/')) {
            throw 'path should begin with /';
        }
        config ||= {};
        config.method = httpMethod;
        config.url = 'https://' + projectHandle + '.exponential.host' + path;
        config.headers ||= {};
        config.headers.exponential_api_secret = exponentialApiKey;
        return axios(config);
    }

    return {
        call: apiCall,
        credits: async () => {
            const creditsResponse = await axios({
                method: 'GET',
                url: 'https://www.exponentialhost.com/api/consumer/credits',
                headers: {
                    exponential_api_secret: exponentialApiKey
                }
            });

            console.log(creditsResponse.data);
            return creditsResponse.data;
        },
        api: api(apiCall)
    };
}
