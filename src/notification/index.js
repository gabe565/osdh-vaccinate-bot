const slack = require('./slack');
const telegram = require('./telegram');
const { entrypoint } = require('../browser');
const {
  slackToken, slackChannel, telegramBotToken, telegramChatId,
} = require('../options');

function init() {
  if (slackToken && slackChannel) {
    slack.init(slackToken, slackChannel);
  }
  if (telegramBotToken && telegramChatId) {
    telegram.init(telegramBotToken, telegramChatId);
  }
}

function sendMessage(message) {
  const promises = [];
  if (slack.enabled()) {
    promises.push(slack.sendMessage(message));
  }
  if (telegram.enabled()) {
    promises.push(telegram.sendMessage(message));
  }
  return Promise.all(promises);
}

function sendLocations(locations) {
  if (locations.length > 0) {
    let message = 'New vaccination appointments available!\n\n';
    for (const location of locations) {
      message += `- ${location.Title}\n`;
    }
    message += `\n${entrypoint}`;
    return sendMessage(message);
  }
  return Promise.resolve();
}

module.exports = { init, sendLocations };
