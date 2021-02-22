const puppeteer = require("puppeteer");

const {headless, osdhId, birthdate} = require("./options.js");

const entrypoint = `https://vaccinate.oklahoma.gov/follow-up-vaccine/?id=${osdhId}`;

async function updateData() {
    const browser = await puppeteer.launch({
        headless: headless,
        executablePath: process.env.CHROMIUM_PATH || null,
        args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    });

    const page = (await browser.pages())[0];

    await page.goto(entrypoint, { waitUntil: "domcontentloaded" });

    // Fill in month
    await page.waitForSelector('#vras_followupmonth');
    await page.select("#vras_followupmonth", (birthdate.getMonth() + 1).toString());

    // Fill in day
    await page.waitForSelector('#vras_followupday');
    await page.select("#vras_followupday", birthdate.getDate().toString());

    // Fill in year
    await page.waitForSelector('#vras_followupyear');
    await page.type("#vras_followupyear", birthdate.getFullYear().toString());

    // Set up Promise which resolves when EntityList is returned
    let result;
    const searchResponse = new Promise(resolve => {
        page.on("response", async response => {
            if (response.url().startsWith("https://vaccinate.oklahoma.gov/EntityList/Map/Search")) {
                const json = await response.json();
                if (json && json.length > 0) {
                    result = json;
                    resolve();
                }
            }
        });
    });

    await page.click("#NextButton");

    // Wait for EntityList response with timeout
    let timeout;
    await Promise.race([
        searchResponse,
        new Promise((resolve, reject) => {
            timeout = setTimeout(
                () => reject("Timeout exceeded while waiting for EntityList result."),
                page._timeoutSettings.timeout()
            )
        }),
    ]);
    clearTimeout(timeout);

    await browser.close();

    return result;
};

module.exports = {entrypoint, updateData};
