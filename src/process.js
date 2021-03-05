const notification = require('./notification');
const { run: runBrowser, haveRequestData } = require('./browser');
const { run: runApi } = require('./api');
const { osdhId, filter } = require('./options');

let recentlyNotified = [];

async function run() {
  let result;
  try {
    if (!haveRequestData()) {
      console.log('Updating data in browser...');
      result = await runBrowser();
    } else {
      console.log('Updating data from API...');
      result = await runApi();
    }
  } catch (error) {
    console.error(error);
    return;
  }

  console.log(`Got ${result.length} locations`);

  // Filter out fully booked locations
  const availableAppointments = result.filter(
    (e) => e.Description !== 'No available booking slots at this location'
      && (!filter || e.Description.toLowerCase().includes(filter.toLowerCase())),
  );

  const toNotify = availableAppointments.filter(
    (e) => !recentlyNotified.includes(e.Id),
  );

  // Add all current IDs to filtered
  recentlyNotified = availableAppointments.map((e) => e.Id);

  if (toNotify.length > 0) {
    console.log('Found locations! Notifying...');
    await notification.sendLocations(toNotify, osdhId);
  } else {
    console.log('No new bookings found');
  }
}

module.exports = run;
