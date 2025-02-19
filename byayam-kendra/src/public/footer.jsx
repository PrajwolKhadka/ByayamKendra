import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import "../css/footer.css"; // Import the CSS file

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 text-center">
      <div className="footer-container flex flex-col items-center gap-4">
        {/* Logo */}
        <h2>ByayamKendra</h2>
        {/* Social Media Links */}
        <div className="footer-social flex gap-6 text-xl">
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        </div>

        {/* Copyright */}
        <p className="footer-copy">&copy; 2025 ByayamKendra. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
