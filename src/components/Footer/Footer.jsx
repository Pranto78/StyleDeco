import React from "react";
import decologo from "../../assets/yyy.png";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-transparent text-gray-200 p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo and About */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-4">
            <img src={decologo} alt="StyleDecor Logo" className="w-12 h-12" />
            <span className="text-2xl font-bold text-primary-gradient">
              StyleDecor
            </span>
          </div>
          <p className="text-gray-400">
            Bringing your dream events to life with luxury and style. Weddings,
            corporate events, birthdays, and more!
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-blue-500">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-pink-500">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-700">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h6 className="font-semibold text-lg mb-2">Services</h6>
          <nav className="flex flex-col gap-1">
            <a href="#" className="link link-hover hover:text-primary">
              Branding
            </a>
            <a href="#" className="link link-hover hover:text-primary">
              Design
            </a>
            <a href="#" className="link link-hover hover:text-primary">
              Marketing
            </a>
            <a href="#" className="link link-hover hover:text-primary">
              Advertisement
            </a>
          </nav>
        </div>

        {/* Company */}
        <div>
          <h6 className="font-semibold text-lg mb-2">Company</h6>
          <nav className="flex flex-col gap-1">
            <a href="#" className="link link-hover hover:text-primary">
              About Us
            </a>
            <a href="#" className="link link-hover hover:text-primary">
              Contact
            </a>
            <a href="#" className="link link-hover hover:text-primary">
              Jobs
            </a>
            <a href="#" className="link link-hover hover:text-primary">
              Press Kit
            </a>
          </nav>
        </div>

        {/* Contact & Working Hours */}
        <div>
          <h6 className="font-semibold text-lg mb-2">Contact & Hours</h6>
          <p>
            Email:{" "}
            <a href="mailto:info@styledecor.com" className="hover:text-primary">
              info@styledecor.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href="tel:+880123456789" className="hover:text-primary">
              +880 1234 567 89
            </a>
          </p>
          <p className="mt-2 font-semibold">Business Hours:</p>
          <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
          <p>Sat - Sun: Closed</p>
        </div>
      </div>

      <div className="text-center mt-10 border-t border-gray-700 pt-4 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} StyleDecor. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
