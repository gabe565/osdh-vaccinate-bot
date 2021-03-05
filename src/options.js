const {program, InvalidOptionArgumentError} = require('commander');
const cron = require('node-cron');

function validateWithinBounds(min, max) {
  return (v) => {
    const i = Number.parseInt(v, 10);
    if (Number.isNaN(i)) throw new InvalidOptionArgumentError('Invalid input.');
    if (i < min || i > max) throw new InvalidOptionArgumentError(`Must be an integer between ${min} and ${max}.`);
    return i.toString();
  };
}

function validateCron(v) {
  if (!cron.validate(v)) throw new InvalidOptionArgumentError('Invalid cron syntax. See https://www.npmjs.com/package/node-cron#cron-syntax for supported syntax.');
  return v;
}

program
  .requiredOption(
    '--osdh-id <osdhId>', 'Vaccination record ID from email link.', process.env.OSDH_ID,
  )
  .requiredOption(
    '--birth-year <birthYear>', 'Four-digit birth year.', validateWithinBounds(1000, 9999), process.env.BIRTH_YEAR,
  )
  .requiredOption(
    '--birth-month <birthMonth>', 'Numeric birth month.', validateWithinBounds(1, 12), process.env.BIRTH_MONTH,
  )
  .requiredOption(
    '--birth-day <birthDay>', 'Numeric birth day.', validateWithinBounds(1, 31), process.env.BIRTH_DAY,
  )
  // Cron options
  .option(
    '--cron <cron>',
    'Run on a cron. Supports the cron syntax defined at https://www.npmjs.com/package/node-cron#cron-syntax.',
    validateCron, process.env.CRON,
  )
  // Filter
  .option('--filter <filter>', 'Filter appointment text (ex: "1st Dose", "2nd Dose", etc).', process.env.FILTER)
  // Telegram options
  .option('--telegram-bot-token <telegramBotToken>', 'Telegram bot token.', process.env.TELEGRAM_BOT_TOKEN)
  .option('--telegram-chat-id <telegramChatId>', 'Telegram chat ID.', process.env.TELEGRAM_CHAT_ID)
  // Slack options
  .option('--slack-token <slackToken>', 'Slack token.', process.env.SLACK_TOKEN)
  .option('--slack-channel <slackChannel>', 'Slack channel.', process.env.SLACK_CHANNEL)
  // Puppeteer options
  .option('--no-headless', 'Run in regular browser instead of a headless one.', false)
  .parse();

module.exports = program.opts();
