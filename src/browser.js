const puppeteer = require('puppeteer');
const {
  osdhId, birthYear, birthMonth, birthDay, headless,
} = require('./options');

const entrypoint = `https://vaccinate.oklahoma.gov/follow-up-vaccine/?id=${osdhId}`;
const apiEndpoint = 'https://vaccinate.oklahoma.gov/EntityList/Map/Search/';

let cookies;
const getCookies = () => cookies;
let postData;
const getPostData = () => postData;
let token;
const getToken = () => token;

const haveRequestData = () => cookies && postData && token;

async function run() {
  const browser = await puppeteer.launch({
    headless,
    executablePath: process.env.CHROMIUM_PATH || null,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });
  const page = (await browser.pages())[0];
  await page.goto(entrypoint, { waitUntil: 'domcontentloaded' });

  // Fill in month
  await page.waitForSelector('#vras_followupmonth');
  await page.select('#vras_followupmonth', birthMonth);

  // Fill in day
  await page.waitForSelector('#vras_followupday');
  await page.select('#vras_followupday', birthDay);

  // Fill in year
  await page.waitForSelector('#vras_followupyear');
  await page.type('#vras_followupyear', birthYear);

  // Save request data for direct API calls afterwards
  page.on('request', async (request) => {
    if (request.url().startsWith(apiEndpoint)) {
      cookies = (await page.cookies()).map((c) => `${c.name}=${c.value}`).join('; ');
      postData = request.postData();
      token = request.headers().__requestverificationtoken;
    }
  });

  // Set up Promise which resolves when EntityList is returned
  let result;
  const searchResponse = new Promise((resolve) => {
    page.on('response', async (response) => {
      if (response.url().startsWith(apiEndpoint)) {
        const json = await response.json();
        if (json && json.length > 0) {
          result = json;
          resolve();
        }
      }
    });
  });

  await page.click('#NextButton');

  // Wait for EntityList response with timeout
  let timeout;
  await Promise.race([
    searchResponse,
    new Promise((resolve, reject) => {
      timeout = setTimeout(
        () => reject(new Error('Timeout exceeded while waiting for EntityList result.')),
        page._timeoutSettings.timeout(),
      );
    }),
  ]);
  clearTimeout(timeout);

  await browser.close();
  return result;
}

module.exports = {
  run, entrypoint, haveRequestData, getCookies, getPostData, getToken, apiEndpoint,
};
