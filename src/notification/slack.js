const { WebClient } = require('@slack/web-api');

let client;
let channel;

function init(token, channel_) {
  client = new WebClient(token);
  channel = channel_;
}

function enabled() {
  return Boolean(client);
}

function sendMessage(text) {
  if (client) {
    return client.chat.postMessage({ channel, text });
  }
  return Promise.reject();
}

module.exports = {
  enabled, init, sendMessage,
};
