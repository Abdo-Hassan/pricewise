'use server';

import Product from '../models/product.model';
import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';
import { scrapeAmazonProduct } from '../scraper';
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils';
import { ProductType } from '@/types';

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
