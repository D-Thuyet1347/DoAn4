import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState('Login');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Xử lý thay đổi dữ liệu form
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Xử lý logic đăng nhập hoặc đăng ký
  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    const endpoint = currState === 'Login' ? '/api/user/login' : '/api/user/register';
    const apiUrl = `${url}${endpoint}`;

    try {
      const response = await axios.post(apiUrl, data);
      const { success, token, message } = response.data;

      if (success) {
        setToken(token);
        localStorage.setItem('token', token);
        setShowLogin(false); // Đóng popup
        toast.success(currState === 'Login' ? 'Đăng nhập thành công!' : 'Đăng ký thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });

        // Reload lại trang sau khi đăng nhập
        setTimeout(() => {
          window.location.reload();
        }, 500); // Delay một chút để hiển thị thông báo
      } else {
        toast.error(message, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onSubmitHandler} className="login-popup-container">
        {/* Tiêu đề và nút đóng */}
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
            className="close-icon"
          />
        </div>

        {/* Các ô nhập liệu */}
        <div className="login-popup-inputs">
          {currState === 'Sign Up' && (
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              value={data.name}
              onChange={onChangeHandler}
              required
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={data.email}
            onChange={onChangeHandler}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={onChangeHandler}
            required
          />
        </div>

        {/* Nút Submit */}
        <button type="submit">
          {currState === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        {/* Điều kiện sử dụng */}
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>

        {/* Chuyển đổi giữa đăng nhập và đăng ký */}
        <p>
          {currState === 'Login' ? (
            <>
              Create a new account?{' '}
              <span onClick={() => setCurrState('Sign Up')}>Click here</span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span onClick={() => setCurrState('Login')}>Login Here</span>
            </>
          )}
        </p>
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default LoginPopup;
