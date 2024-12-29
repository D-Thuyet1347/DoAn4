import React, { useContext} from 'react'
import './Fooditem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addTocart, removeFromCart, url } = useContext(StoreContext);
  const navigate = useNavigate(); // Sử dụng điều hướng

  const handleProductClick = () => {
    navigate(`/product/${id}`); // Chuyển hướng đến trang ProductDetails với ID sản phẩm
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container" onClick={handleProductClick}>
        <img
          className="food-item-image"
          src={url + "/images/" + image}
          alt={name}
        />
        {/* {!cartItems[id] ? (
          <img
            className="add"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn việc kích hoạt sự kiện cha
              addTocart(id);
            }}
            src={assets.add_icon_white}
            alt="Add to cart"
          />
        ) : (
          <div
            className="food-item-counter"
            onClick={(e) => e.stopPropagation()} // Ngăn sự kiện cha
          >
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="Remove from cart"
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addTocart(id)}
              src={assets.add_icon_green}
              alt="Add more"
            />
          </div>
        )} */}
      </div>
      <div className="food-item-info" onClick={handleProductClick}>
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};


export default FoodItem
