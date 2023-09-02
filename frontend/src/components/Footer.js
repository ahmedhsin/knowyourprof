import React from 'react';
import '../assets/footer.css';
const Footer = () => {
  return (
    <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Ahmed Mubarak. All rights reserved.</p>
        <p>UI &amp; UX by Yousf Salah</p>
    </footer>
  );
};

export default Footer;
