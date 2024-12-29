import React, { useState } from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  const [selectedTime, setSelectedTime] = useState('');

  const handleTimeClick = (time) => {
    if (selectedTime === time) {
      setSelectedTime('');
      setCategory('ALL');
    } else {
      setSelectedTime(time);
      setCategory(time);
    }
  };

  const morningCategories = menu_list.slice(0, 3);
  const lunchCategories = menu_list.slice(3, 6);
  const eveningCategories = menu_list.slice(6, 8);

  let filteredMenuList = menu_list;
  if (selectedTime === 'Morning') {
    filteredMenuList = morningCategories;
  } else if (selectedTime === 'Lunch') {
    filteredMenuList = lunchCategories;
  } else if (selectedTime === 'Evening') {
    filteredMenuList = eveningCategories;
  }

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delicious array of dishes, each crafted with the finest ingredients to tantalize your taste buds.
      </p>
      <div className="explore-menu-list-include">
        <button
          className={`btn ${selectedTime === 'Morning' ? 'active' : ''}`}
          onClick={() => handleTimeClick('Morning')}
        >
          Morning
        </button>
        <button
          className={`btn ${selectedTime === 'Lunch' ? 'active' : ''}`}
          onClick={() => handleTimeClick('Lunch')}
        >
          Lunch
        </button>
        <button
          className={`btn ${selectedTime === 'Evening' ? 'active' : ''}`}
          onClick={() => handleTimeClick('Evening')}
        >
          Evening
        </button>
      </div>
      <div className="explore-menu-list">
        {filteredMenuList.map((item, index) => (
          <div
            onClick={() => setCategory(prev => prev === item.menu_name ? "ALL" : item.menu_name)}
            key={index}
            className="explore-menu-list-item"
          >
            <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt='' />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;

