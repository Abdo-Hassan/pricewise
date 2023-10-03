import axios from 'axios';

export const scrapeAmazonProduct = async (url: string) => {
  if (!url) return;

  // Bright data proxy configuration
  // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_e76fe271-zone-unblocker:5iangdigze1l -k https://lumtest.com/myip.json
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch from product page
    const response = await axios.get(url, options);
  } catch (error: any) {
    throw new Error(`Failed  to scrape product : ${error.message}`);
  }
};
