# consumer-utils

---
<a href="https://github.com/Exponential-Hosting/utils/issues"><img src="https://img.shields.io/github/issues/Exponential-Hosting/consumer-utils"></a>
<a href="https://github.com/Exponential-Hosting/utils/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Exponential-Hosting/consumer-utils"></a>
<a href="https://twitter.com/intent/tweet?text=https%3A%2F%2Fgithub.com%2FExponential-Hosting%2Fconsumer-utils"><img src="https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2FExponential-Hosting%2Fconsumer-utils"></a>


## Installation:

```
npm install @exponential/consumer-utils
```

## Quick Start:

```js
const exponential = require('@exponential/consumer-utils')(process.env.EXPONENTIAL_API_KEY);

exponential.call('website-screenshot-api', 'GET', '/', {
    params: {
        url: 'blog.exponentialhost.com'
    }
});
exponential.call('tweet-image', 'POST', '/image', {
    headers: {
        "content-type": "application/json"
    },
    body: {
        "twitterUrl": "https://twitter.com/narendramodi/status/1571162212190007298",
        "imageType": "square",
        "templates": [
            "crisp"
        ]
    }
});


```

## call()

Use the call function to call any exponential API as mentioned above. `exponential.call(projectHandle, method, path, config)`. `config` is an object containing optionally additional HTTP headers (`headers`), request body (`data`), and URL params (`params`).

## credits()

Get your remaining credits

```js
const exponential = require('@exponential/consumer-utils')(process.env.EXPONENTIAL_API_KEY);

console.log(exponential.credits); // Response: {credits_available: { freeCredits: <integer>, purchasedCredits: <integer> }, balanceCredits: <integer>, cumulativeTotalCredits: <integer>}
```