const TelegramBot = require('node-telegram-bot-api');

const { botToken, chatId } = require('./options.js');
const { entrypoint } = require('./puppeteer.js');

const enabled = botToken && chatId;

let bot;
if (enabled) {
  bot = new TelegramBot(botToken);
}

function sendMessage(text, form = {}) {
  if (bot) {
    return bot.sendMessage(chatId, text, form);
  }
  return Promise.reject();
}

function sendLocations(locations) {
  if (locations.length > 0) {
    const message = `
New vaccination appointments available!

- ${locations.map((e) => e.Title).join('\n- ')}

${entrypoint}
`;
    sendMessage(message);
  }
}

module.exports = { enabled, sendMessage, sendLocations };
