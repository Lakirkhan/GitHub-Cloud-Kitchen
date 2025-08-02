"use client";

import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaShippingFast,
} from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-logo">
          <h2>
            <FaShippingFast />
            Cloud Kitchen
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        <div className="footer-section footer-links">
          <h3>INFORMATION</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/aboutus">About</Link>
            </li>
            <li>
              <Link to="/contactus">Contact</Link>
            </li>
            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section footer-contacts">
          <h3>CONTACTS</h3>
          <ul>
            <li>
              <MdLocationOn className="contact-icon" />
              <span>Wall Street-2 Ellish Bridge Ahemdabad</span>
            </li>
            <li>
              <MdPhone className="contact-icon" />
              <span>+91-7574812451</span>
            </li>
            <li>
              <MdEmail className="contact-icon" />
              <span>CloudKitchen@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Alissio. All Rights Reserved</p>
        <div className="bottom-links">
          <Link to="/">Privacy Policy</Link>
          <span className="divider">|</span>
          <Link to="/">Cookie Policy</Link>
          <span className="divider">|</span>
          <Link to="/">Terms & Conditions</Link>
        </div>
      </div>

      {/* <button
        className="scroll-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        ⬆
      </button> */}
    </footer>
  );
};

export default Footer;
