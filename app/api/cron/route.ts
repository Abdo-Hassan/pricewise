import Product from '@/lib/models/product.model';
import { connectToDB } from '@/lib/mongoose';
import { generateEmailBody, sendEmail } from '@/lib/nodemailer';
import { scrapeAmazonProduct } from '@/lib/scraper';
import {
  getAveragePrice,
  getEmailNotificationType,
  getHighestPrice,
  getLowestPrice,
} from '@/lib/utils';
import { User } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDB();
    const products = await Product.find({});

    if (!products) throw new Error('No products found');

    // 1. SCRAPE LATEST PRODUCT DETAILS & UPDATE DB
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

        if (!scrapedProduct) throw new Error('No products found');

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updatedProduct = await Product.findOneAndUpdate(
          { url: scrapedProduct.url },
          product
        );

        // 2.CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY

        const emailNotificationType = getEmailNotificationType(
          scrapedProduct,
          currentProduct
        );

        if (emailNotificationType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };

          const emailContent = await generateEmailBody(
            productInfo,
            emailNotificationType
          );

          const userEmails = updatedProduct.users.map(
            (user: User) => user.email
          );

          await sendEmail(emailContent, userEmails);
        }
      })
    );

    return NextResponse.json({
      message: 'OK',
      data: updatedProducts,
    });
  } catch (error: any) {
    console.log('error:', error);
    throw new Error('Error in GET', error);
  }
}
