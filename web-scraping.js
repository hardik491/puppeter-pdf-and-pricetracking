const puppeteer = require("puppeteer");
const cron = require("node-cron");
const nodemailer = require('nodemailer');

const URL =
  "https://www.amazon.in/Mitsubishi-Heavy-SRK13CRS-Split-Conditioner/dp/B07FDLHDVS";

const checkPrice = async () => {
  const browser = await puppeteer.launch({
    /* headless: false, */
    defaultViewport: false,
    userDataDir: "./pdf",
  });

  const page = await browser.newPage();

  await page.goto(URL);

  /* 
  await page.screenshot({path: 'ss.png'});
  const htmlData = await page.$eval('.a-price-whole', el => el); 
  */

  const itemPrice = await page.evaluate(() => {
    const price = document.querySelector(".a-price-whole");
    return price && price.textContent ? price.textContent : null;
  });
  await browser.close();

  if(!itemPrice) {
    throw new Error('Not able to track the price of selected item!')
  }
  return parseFloat(itemPrice.replace(/,/g, ""));
};

const sendMail = async (price) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "email@gmail.com",
      pass: "APP_PASSWORD", // Provide only app password
    },
  });

  const from = "Price Tracker<aaravseth09@gmail.com>";
  const to = "hardik.thakar49@gmail.com";
  const subject = `AC Price`;
  const html = `<span>Go check by clicking on <a href="${URL}"> This link </a></span>`;
  const text = `Current price is ${price}`;

  try {
    const sendMail = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });

    console.info(`Mail sent !------ ${sendMail.messageId}`);
  } catch (err) {
    console.error("Mail not sent!", err);
  }
  return;
};

const priceTracking = async () => {
  const price = await checkPrice();

  if (price <= 45000) {
    await sendMail(price);
  } else {
    console.info(`No mail sent. The price is ${price}`);
  }
};

cron.schedule('* * * * *', priceTracking);
