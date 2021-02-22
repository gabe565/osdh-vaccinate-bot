const cron = require("node-cron");
require('log-timestamp');

const { schedule } = require("./options");
const { updateData } = require("./puppeteer");
const telegram = require("./telegram");

async function loop() {
    console.log("Updating data...");

    let result;
    try {
        result = await updateData();
    } catch (error) {
        console.error(error);
        return;
    }

    console.log(`Got ${result.length} locations`);

    // Filter out fully booked locations
    result = result.filter(
        e => e.Description !== "No available booking slots at this location"
    );

    if (result.length > 0) {
        if (telegram.enabled) {
            console.log("Found locations! Sending Telegram message...");
            await telegram.sendLocations(result);
        }
    } else {
        console.log("No bookings available");
    }
}

if (schedule) {
    telegram.sendMessage(
        `OSDH Vaccination Notifier has started watching on schedule: \`${schedule}\``,
        { parse_mode: "MarkdownV2" }
    );

    cron.schedule(schedule, loop);
} else {
    loop();
}
