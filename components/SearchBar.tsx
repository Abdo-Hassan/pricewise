'use client';

import { scrapeAndStoreProduct } from '@/lib/actions';
import React, { FormEvent, useState } from 'react';

const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidAmazonProductURL = (url: string) => {
      try {
        const parsedURL = new URL(url);
        const hostname = parsedURL.hostname;

        // check if hostname contains amazon.com
        if (
          hostname.includes('amazon.com') ||
          hostname.includes('amazon.') ||
          hostname.endsWith('amazon')
        ) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log('isValidAmazonProductURL error', error);
      }
    };

    const isValidLink = isValidAmazonProductURL(searchPrompt);
    if (!isValidLink) return alert('Please provide a valid amazon link');

    try {
      setIsLoading(true);
      // Scrape the product page
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log('error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
      <input
        type='text'
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder='Enter product link'
        className='searchbar-input'
      />

      <button
        disabled={searchPrompt === '' || isLoading}
        type='submit'
        className='searchbar-btn'>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default SearchBar;
