'use server';

import { scrapeAmazonProduct } from '../scraper';

export const scrapeAndStoreProduct = async (productUrl: string) => {
  if (!productUrl) return;

  try {
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
  } catch (error: any) {
    throw new Error(`Failed  to create/update product : ${error.message}`);
  }
};
