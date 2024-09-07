'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side
    const handleResize = () => {
      if (window.innerWidth >= 768) { // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="w-full px-16 py-8">
      <nav className="flex items-center justify-between">
        <div className='flex items-center'>
          <div className="text-3xl font-light "><Link href="/">Vincent </Link></div>

          <ul className="hidden lg:flex lg:flex-row lg:ml-14 font-extralight text-lg">
            <li className='lg:w-36 lg:text-center'><Link href="/about" className="duration-300 text-slate-700 hover:font-light hover:underline">About</Link></li>
            <li className='lg:w-36 lg:text-center'><Link href="/projects" className="duration-300 text-slate-700 hover:font-light hover:underline">Projects</Link></li>
            <li className='lg:w-36 lg:text-center'><Link href="/contact" className="duration-300 text-slate-700 hover:font-light hover:underline">Contact me</Link></li>
          </ul>
        </div>

        <button className="lg:hidden 
        p-2 rounded-lg transition-all duration-300 ease-in-out 
        hover:bg-slate-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </nav>
      <ul className={`lg:hidden font-extralight text-right ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <li className='py-2'><Link href="/about" className="duration-300 text-slate-700 hover:font-light hover:underline">About</Link></li>
        <li className='py-2'><Link href="/projects" className="duration-300 text-slate-700 hover:text-black hover:font-light hover:underline">Projects</Link></li>
        <li className='py-2'><Link href="/contact" className="duration-300 text-slate-700 hover:text-black hover:font-light hover:underline">Contact me</Link></li>
      </ul>
    </header>
  );
};

export default Header;