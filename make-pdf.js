/* Make pdf by visiting web page */
const puppeteer = require("puppeteer");

const createPdf = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const options = {
    path: "pdf/mypdf.pdf",
    format: "A4",
  };

  const URL = "https://javascript.plainenglish.io/basic-javascript-mistakes-and-best-practices-aa97ffc0e553";
  await page.goto(URL, { waitUntil: "networkidle2" });
  await page.pdf(options);
  await browser.close();
};

createPdf();