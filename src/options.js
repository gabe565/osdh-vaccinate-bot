const { program, InvalidOptionArgumentError } = require('commander');
const cron = require('node-cron');

function testWithinBounds(min, max) {
  return (v) => {
    const i = Number.parseInt(v, 10);
    if (Number.isNaN(i)) throw new InvalidOptionArgumentError('Invalid input.');
    if (i < min || i > max) throw new InvalidOptionArgumentError(`Must be an interger between ${min} and ${max}.`);
    return i.toString();
  };
}

program
  .requiredOption('--osdh-id <osdhId>', 'Vaccination record ID', process.env.OSDH_ID)
  .requiredOption('--birth-year <birthYear>', 'Four-digit birth year', testWithinBounds(1000, 9999), process.env.BIRTH_YEAR)
  .requiredOption('--birth-month <birthMonth>', 'Numeric birth month', testWithinBounds(1, 12), process.env.BIRTH_MONTH)
  .requiredOption('--birth-day <birthDay>', 'Numeric birth day', testWithinBounds(1, 31), process.env.BIRTH_DAY)

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
