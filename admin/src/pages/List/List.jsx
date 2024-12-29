
import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input, Modal, Button, Form } from 'antd';

const List = () => {
  const url = 'http://localhost:4000';
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Error fetching food list');
      }
    } catch (error) {
      toast.error('Unable to fetch the food list');
    }
  };

  const handleDailyMenuChange = (food, category) => {
    setCategories((prev) => ({
      ...prev,
      [category]: [...prev[category], food],
    }));
    toast.success(`Added "${food.name}" to ${category}`);
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    if (response.data.success) {
      fetchList();
      toast.success(response.data.message);
    } else {
      toast.error('Error removing food');
    }
  };


  useEffect(() => {
    fetchList();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="list add flex-col">
      <p>ALL Foods List</p>

      {/* Thanh tìm kiếm */}
      <Input.Search
        placeholder="Search for a food"
        onChange={handleSearch}
        style={{ marginBottom: 20 }}
      />

      {/* Danh sách món ăn */}
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Daily Menu</b>
          <b>Action</b>
        </div>
        {filteredList.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={`${url}/images/` + item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price}</p>
            <select
              onChange={(e) => handleDailyMenuChange(item, e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select Daily Menu
              </option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
            <div>
             
              <button
                onClick={() => removeFood(item._id)}
                className="action-btn remove"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="categories">
        {Object.keys(categories).map((category) => (
          <div key={category} className="category-column">
            <h3>{category}</h3>
            <ul>
              {categories[category].map((food) => (
                <li key={food._id}>{food.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default List;
