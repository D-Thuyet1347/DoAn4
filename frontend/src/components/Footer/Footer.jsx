import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>The Food is a rich tapestry of flavors and textures that have evolved over centuries. <br></br>The delicate balance of sweet, sour, salty, and umami flavors is what sets Vietnamese dishes apart.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+84 908-333-33</li>
            <li>Contact@TheFood.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        CopyRight 2024 TheFood.cpm - ALL right reserved.
      </p>
    </div>
  );
};

export default Footer;
