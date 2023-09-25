import React from "react";
import "../assets/footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} Ahmed Mubarak. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
