const notification = require('./notification');
const { run: runBrowser, haveRequestData } = require('./browser');
const { run: runApi } = require('./api');
const { osdhId, filter } = require('./options');

let recentlyNotified = [];

async function run() {
  let result;
  try {
    if (!haveRequestData()) {
      console.log('Initial run in browser to get API keys...');
      result = await runBrowser();
    } else {
      console.log('Updating data from API...');
      result = await runApi();
    }
  } catch (error) {
    console.error(error);
    return;
  }

  // Filter out fully booked locations
  const availableAppointments = result.filter(
    (e) => e.Description !== 'No available booking slots at this location'
      && (!filter || `${e.Title} ${e.Description}`.toLowerCase().includes(filter.toLowerCase())),
  );

  const toNotify = availableAppointments.filter(
    (e) => !recentlyNotified.includes(e.Id),
  );

  console.log(`${result.length} total locations. ${availableAppointments.length} available, ${availableAppointments.length - toNotify.length} previously notified.`);

  // Add all current IDs to filtered
  recentlyNotified = availableAppointments.map((e) => e.Id);

  if (toNotify.length > 0) {
    console.log(`Sending notification with ${toNotify.length} locations.`);
    await notification.sendLocations(toNotify, osdhId);
  }
}

module.exports = run;
