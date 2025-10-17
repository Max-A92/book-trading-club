import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          {/* Footer Links */}
          <div className="footer__links">
            <Link to="/" className="footer__link">Home</Link>
            <Link to="/books" className="footer__link">Bücher</Link>
            <Link to="/users" className="footer__link">User</Link>
          </div>

          {/* Copyright */}
          <div className="footer__copyright">
            <p>© {currentYear} Book Trading Club. FreeCodeCamp Project.</p>
          </div>

          {/* Credits */}
          <div className="footer__credits">
            <p>Erstellt mit React, Node.js & MongoDB</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;