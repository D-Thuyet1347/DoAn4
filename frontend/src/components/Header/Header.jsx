import React, { useState, useEffect } from "react";
import "./Header.css";
import { assets } from "../../assets/assets";

const Header = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [assets.bg1, assets.bg2, assets.bg3, assets.bg4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="header">
      <div className="header-contents">
        <div className="item">
          <img
            src={images[currentIndex]}
            alt={`Background ${currentIndex + 1}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
