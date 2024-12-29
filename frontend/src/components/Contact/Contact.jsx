import React from "react";
import "./Contact.css"; // Import CSS
import { assets } from "../../assets/assets"; // Import assets

const Contact = () => {
  const icons = [
    { id: 1, image: assets.phone, link: "tel:+1234567890" },
    { id: 2, image: assets.mess, link: "https://www.facebook.com/profile.php?id=61569283482578" },
  ];

  return (
    <div className="homepage-contact-container">
      {icons.map((item) => (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer" /* Bảo mật */
          className="homepage-icon-container" /* Sử dụng class CSS */
        >
          <img src={item.image} alt="contact icon" className="homepage-contact-image" />
        </a>
      ))}
    </div>
  );
};

export default Contact;