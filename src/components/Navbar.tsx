
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-one-darker/80 backdrop-blur-lg shadow-md'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Logo className="z-20" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/features"
              className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              to="/contact"
              className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            >
              Contact
            </Link>
            <button className="interactive-button">Get Started</button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden z-20 text-one-text-muted hover:text-one-text" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-10 bg-one-darker/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-lg">
          <Link
            to="/"
            className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/features"
            className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            to="/contact"
            className="text-one-text-muted hover:text-one-text transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <button
            className="interactive-button mt-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
