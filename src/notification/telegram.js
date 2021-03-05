const TelegramBot = require('node-telegram-bot-api');

let client;
let chatId;

function init(botToken, chatId_) {
  client = new TelegramBot(botToken);
  chatId = chatId_;
}

function enabled() {
  return Boolean(client);
}

function sendMessage(text, form = {}) {
  if (client) {
    return client.sendMessage(chatId, text, form);
  }
  return Promise.reject();
}

module.exports = {
  enabled, init, sendMessage,
};
