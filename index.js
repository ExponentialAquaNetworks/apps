const axios = require("axios");
const api = require("./api.js");

module.exports = function (datacloudApiKey) {
    if (typeof datacloudApiKey !== 'string') {
        throw 'Please pass a valid Datacloud API key';
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
        config.url = 'https://' + projectHandle + '.datacloud.sh' + path;
        config.headers ||= {};
        config.headers.datacloud_api_secret = datacloudApiKey;
        return axios(config);
    }

    return {
        call: apiCall,
        credits: async () => {
            const creditsResponse = await axios({
                method: 'GET',
                url: 'https://app.datacloud.sh/api/consumer/credits',
                headers: {
                    datacloud_api_secret: datacloudApiKey
                }
            });

            console.log(creditsResponse.data);
            return creditsResponse.data;
        },
        api: api(apiCall)
    };
}
