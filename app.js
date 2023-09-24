const express = require('express');
const puppeteer = require('puppeteer');
const winston = require('winston');
require('dotenv').config(); 
const app = express();
const port = process.env.PORT || 3000;

// Create a Winston logger instance
const logger = winston.createLogger({
    level: 'info', // Set the logging level
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console(), // Log to the console
      new winston.transports.File({ filename: 'app.log' }) // Log to a file
    ],
  });

// Define an asynchronous function for the root endpoint
app.get('/', async (req, res) => {
    try {
      // Launch a headless browser
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Navigate to the website
  await page.goto('https://www.cutebabyvote.com/september-2023/?contest=photo-detail&photo_id=289590');

  // Wait for the button to appear (you may need to customize this selector)
  const btnSelector = '.pc-image-info-box-button-btn.photo_vote.pc-show';
  await page.waitForSelector(btnSelector);

  // Use page.evaluate to extract the value or text content
  const elementValue = await page.evaluate(() => {
    // Replace '.example-element' with your element selector
    const element = document.querySelector('.pc-image-info-box-button-btn.photo_vote.pc-show');
    console.log(element.textContent);
    // Extract the value or text content of the element
    return element.textContent; // or element.value for input elements
  });

  // Click on the button
  await page.click(btnSelector);
  logger.info('Button Clicked.');

  // Wait for some time (optional, for demonstration purposes)
  await page.waitForTimeout(2000);

  // Close the browser
  await browser.close();
      res.json({ message: 'Hello, World!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
