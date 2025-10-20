'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Detect touch device once on mount
  useEffect(() => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoized event handlers
  const handleMenuToggle = useCallback(() => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const handleMouseEnter = useCallback(() => {
    if (!isTouchDevice) setIsMobileMenuOpen(true);
  }, [isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    if (!isTouchDevice) setIsMobileMenuOpen(false);
  }, [isTouchDevice]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        menuRef.current && 
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Menu item component for DRY code
  const NavItem = ({ href, text }: { href: string; text: string }) => (
    <li className='lg:w-36 lg:text-center'>
      <Link 
        href={href} 
        className="duration-300 text-slate-700 hover:font-light hover:text-blue-600 hover:underline"
      >
        {text}
      </Link>
    </li>
  );

  // Mobile menu item component
  const MobileNavItem = ({ href, text, hasBorder = true }: { href: string; text: string; hasBorder?: boolean }) => (
    <li className={`py-3 w-full text-right ${hasBorder ? 'border-b border-blue-200' : ''}`}>
      <Link 
        href={href} 
        className="block w-full text-slate-700 hover:font-light hover:text-blue-600 hover:underline"
      >
        {text}
      </Link>
    </li>
  );

  // Fix: Add proper type definition for the styles
  const dropdownStyles: React.CSSProperties = {
    maxHeight: isMobileMenuOpen ? '300px' : '0',
    visibility: isMobileMenuOpen ? 'visible' : 'hidden',
    transform: isMobileMenuOpen ? 'scaleY(1)' : 'scaleY(0)',
    transformOrigin: 'top',
    boxShadow: isMobileMenuOpen 
      ? '0 8px 15px -10px rgba(59, 130, 246, 0.3), 0 4px 6px -4px rgba(59, 130, 246, 0.1)' 
      : 'none'
  };

  return (
    <header className="w-full px-5 lg:px-16 py-8 relative bg-header-gradient">
      <nav className="flex items-center justify-between">
        <div className='flex items-center'>
          <div className="text-3xl font-light">
            <Link href="/">Vincent</Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex lg:flex-row lg:ml-14 font-extralight text-lg">
            <NavItem href="/about" text="About" />
            <NavItem href="/skills" text="Skills" />
            <NavItem href="/web3" text="Web3" />
            <NavItem href="/contact" text="Contact me" />
          </ul>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          ref={buttonRef}
          className="lg:hidden p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-100 z-50" 
          onMouseEnter={handleMouseEnter}
          onClick={handleMenuToggle}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg 
            className="w-6 h-6 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div 
        ref={menuRef}
        className="lg:hidden absolute left-0 right-0 top-full bg-dropdown-gradient border-b border-blue-100 z-40 transition-all duration-300 ease-in-out origin-top"
        style={dropdownStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container mx-auto px-5 py-3">
          <ul className="w-full font-extralight text-lg flex flex-col items-end">
            <MobileNavItem href="/about" text="About" />
            <MobileNavItem href="/skills" text="Skills" />
            <MobileNavItem href="/web3" text="Web3" />
            <MobileNavItem href="/contact" text="Contact me" hasBorder={false} />
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;