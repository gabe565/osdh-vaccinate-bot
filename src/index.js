const cron = require('node-cron');
require('log-timestamp');

const { cron: cronConfig } = require('./options');
const process = require('./process');
const notification = require('./notification');

async function run() {
  notification.init();
  await process();
  if (cronConfig) {
    cron.schedule(cronConfig, process, { scheduled: true });
  }
}

module.exports = run;
