const { program, InvalidOptionArgumentError } = require('commander');
const cron = require('node-cron');

program
  .requiredOption('--osdh-id <osdhId>', 'Vaccination record ID', process.env.OSDH_ID)
  .requiredOption('--birthdate <birthdate>', 'Birthdate', (v) => {
    const date = new Date(v);
    if (Number.isNaN(date.getTime())) throw new InvalidOptionArgumentError();
    return date;
  }, new Date(process.env.BIRTHDATE))

// Puppeteer options
  .option('-h, --headless', 'Run in headless browser', Boolean(process.env.HEADLESS))

// Telegram options
  .option('--bot-token <botToken>', 'Telegram bot token', process.env.TELEGRAM_BOT_TOKEN)
  .option('--chat-id <chatId>', 'Telegram chat ID', process.env.TELEGRAM_CHAT_ID)

// Cron options
  .option('--schedule <schedule>', 'Cron schedule', (v) => {
    if (!cron.validate(v)) throw new InvalidOptionArgumentError();
    return v;
  }, process.env.SCHEDULE);

program.parse();

module.exports = program.opts();
