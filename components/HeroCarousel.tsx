'use client';

import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Hand from '../public/assets/icons/hand-drawn-arrow.svg';
import Hero1 from '../public/assets/images/hero-1.svg';
import Hero2 from '../public/assets/images/hero-2.svg';
import Hero3 from '../public/assets/images/hero-3.svg';
import Hero4 from '../public/assets/images/hero-4.svg';
import Hero5 from '../public/assets/images/hero-5.svg';
import Image from 'next/image';

const HeroCarousel = () => {
  const heroImage = [
    { imageUrl: Hero1, alt: 'smartwatch' },
    { imageUrl: Hero2, alt: 'bag' },
    { imageUrl: Hero3, alt: 'lamp' },
    { imageUrl: Hero4, alt: 'air fryer' },
    { imageUrl: Hero5, alt: 'chair' },
  ];
  return (
    <div className='hero-carousel'>
      <Carousel
        showThumbs={false}
        // autoPlay
        infiniteLoop
        // interval={2000}
        showArrows={false}
        showStatus={false}>
        {heroImage.map((hero) => (
          <Image
            width={484}
            height={484}
            src={hero.imageUrl}
            key={hero.alt}
            alt={hero.alt}
          />
        ))}
      </Carousel>

      <Image
        src={Hand}
        alt='arrow'
        width={175}
        height={175}
        className='max-xl:hidden absolute -left-[15%] bottom-0 z-0'
      />
    </div>
  );
};

export default HeroCarousel;
