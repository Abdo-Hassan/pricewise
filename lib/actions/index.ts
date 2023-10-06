'use server';

import { User } from './../../types/index';
import Product from '../models/product.model';
import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';
import { scrapeAmazonProduct } from '../scraper';
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils';
import { ProductType } from '@/types';
import { generateEmailBody, sendEmail } from '../nodemailer';

export const scrapeAndStoreProduct = async (productUrl: string) => {
  if (!productUrl) return;

  try {
    await connectToDB();
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapedProduct) return;

    let product = scrapedProduct;
    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed  to create/update product : ${error.message}`);
  }
};

export const getProductById = async (productId: string) => {
  try {
    await connectToDB();

    const product: ProductType | null = await Product.findOne({
      _id: productId,
    });

    if (!product) return null;

    return product;
  } catch (error) {
    console.log('error:', error);
  }
};

export const getAllProducts = async () => {
  try {
    await connectToDB();
    const products: ProductType[] = await Product.find();
    return products;
  } catch (error) {
    console.log('error:', error);
  }
};

export const getSimilarProducts = async (productId: string) => {
  try {
    await connectToDB();
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log('error:', error);
  }
};

export const addUserEmailToProduct = async (
  productId: string,
  userEmail: string
) => {
  try {
    const product = await Product.findById(productId);

    if (!product) return;

    const userExists = product.users.some(
      (user: User) => user.email === userEmail
    );

    if (!userExists) {
      product.users.push({ email: userEmail });
      await product.save();
      const emailContent = generateEmailBody(product, 'WELCOME');

      await sendEmail(await emailContent, [userEmail]);
    }
  } catch (error) {
    console.log('error:', error);
  }
};
