import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import SearchComponent from "../SearchComponent/SearchComponent"; // Import SearchComponent

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  const navigate = useNavigate();

  // Hàm logout
  const logout = () => {
    localStorage.removeItem("token"); // Xóa token từ localStorage
    setToken("");                     // Reset token trong Context
    // navigate("/");                    // Điều hướng về trang chủ
    window.location.reload();         // Reload lại trang
  };
  

  return (
    <div className="navbar">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>

      {/* Menu Items */}
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile App
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>

      {/* Right Side Items */}
      <div className="navbar-right">
        {/* Search Component */}
        <SearchComponent />

        {/* Cart */}
        <div className="navbar-cart">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          {getTotalCartAmount() > 0 && <div className="dot"></div>}
        </div>
        <Link to='/voucher-list-user'><img  src={assets.voucher_icon} alt=''/></Link>
        {/* Authentication */}
        {!token ? (
          <button
            style={{ width: "25%" }}
            onClick={() => setShowLogin(true)}
          >
            Sign In
          </button>
        ) : (
          <div className="nav-profile">
            <img src={assets.profile_icon} alt="Profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="Orders" />
                <p>Orders</p>
              </li>
              <hr />
              
              <li onClick={() => navigate('/customerinfo')}>
                  <img src={assets.info1_icon} alt="" />
                  <p>Profile</p>
                </li>
                <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;