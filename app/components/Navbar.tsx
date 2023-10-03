import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Logo from '../../public/assets/icons/logo.svg';
import Search from '../../public/assets/icons/search.svg';
import Heart from '../../public/assets/icons/black-heart.svg';
import User from '../../public/assets/icons/user.svg';

const navIcons = [
  { src: Search, alt: 'search' },
  { src: Heart, alt: 'heart' },
  { src: User, alt: 'User' },
];

const Navbar = () => {
  return (
    <header className='w-full'>
      <nav className='nav'>
        <Link href='/' className='flex items-center'>
          <Image src={Logo} alt='Logo' width={27} height={27} />

          <p className='nav-logo pl-1'>
            Price <span className='text-primary'>Wise</span>
          </p>
        </Link>

        <div className='flex items-center gap-5'>
          {navIcons?.map((icon) => (
            <>
              <Image
                key={icon.alt}
                src={icon.src}
                alt={icon.alt}
                width={28}
                height={28}
                className='object-contain'
              />
            </>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
