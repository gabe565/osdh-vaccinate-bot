const axios = require('axios');
const {
  apiEndpoint, getCookies, getPostData, getToken,
} = require('./browser');

async function run() {
  const resp = await axios.post(
    apiEndpoint,
    getPostData(),
    {
      headers: {
        Cookie: getCookies(),
        __RequestVerificationToken: getToken(),
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
      },
    },
  );
  return resp.data;
}

module.exports = { run };
