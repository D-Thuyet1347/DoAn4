import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import Fuse from 'fuse.js'; // Thư viện để tìm kiếm tương tự
import './SearchComponent.css';

const SearchComponent = () => {
  const { food_list } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(true);

  // Cấu hình Fuse.js để tìm kiếm tương tự
  const fuse = new Fuse(food_list, {
    keys: ['name'], // Tìm kiếm theo thuộc tính 'name'
    threshold: 0.4, // Độ chính xác: 0.0 (hoàn hảo) -> 1.0 (rộng hơn)
  });

  // Lọc sản phẩm dựa trên từ khóa
  const filteredFoodList = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : [];

  const handleSearchItemClick = () => {
    setIsSearchActive(false);
  };

  return (
    <div className='search-component'>
      <div className='search-input-container'>
        <input
          type='text'
          className='search-input'
          placeholder='Search for food items...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchActive(true)}
        />
        <FaSearch className='search-icon' />
      </div>

      {isSearchActive && searchQuery && (
        <div className='search-results'>
          {filteredFoodList.length > 0 ? (
            filteredFoodList.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className='search-item-link'
                onClick={handleSearchItemClick}
              >
                <p>{item.name}</p>
              </Link>
            ))
          ) : (
            <p>No similar results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
