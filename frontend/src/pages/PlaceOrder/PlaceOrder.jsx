import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const PlaceOrder = () => {
  const location = useLocation();
  const { voucherDiscount, maximumDiscount, note: cartNote } = location.state || {};
  const { getTotalCartAmount, token, url, food_list, cartItems } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", gender: "", zipcode: "", address: "", phone: "", note: cartNote || ""
  });
  const navigate = useNavigate();

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error decoding token", e);
      return null;
    }
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      return decodedToken ? decodedToken.id : null;
    }
    return null;
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      toast.error('User not authenticated.');
      navigate('/cart');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${url}/api/user/${userId}`);
        if (response.data.success) {
          const userData = response.data.data;
          setData(prevData => ({
            ...prevData,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            address: userData.address || '',
            gender: userData.gender || '',
            zipcode: userData.zipcode || '',
            phone: userData.phone || ''
          }));
        } else {
          toast.error('Failed to fetch user data.');
        }
      } catch (err) {
        console.error(err);
        toast.error('An error occurred while fetching user data.');
      }
    };

    fetchUserData();
  }, [userId, url, navigate]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${url}/api/user/update/${userId}`, data);
      if (response.data.success) {
        toast.success('Customer information updated successfully!');
      } else {
        toast.error('Failed to update customer information.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while updating the customer information.');
    }
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    // Check if the cart is empty
    if (Object.keys(cartItems).length === 0 || getTotalCartAmount() === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }

    // Validate form fields
    const { firstName, lastName, email, gender, zipcode, phone, address } = data;
    if (!firstName || !lastName || !email || !gender || !zipcode || !phone || !address) {
      toast.error('Please fill in all the required fields.');
      return;
    }
    if (!/^\d+$/.test(zipcode)) {
      toast.error('Zip code must contain only numbers');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    await handleSubmit(event);

    const orderItems = food_list.filter(item => cartItems[item._id]).map(item => ({ ...item, quantity: cartItems[item._id] }));

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      note: data.note
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        toast.error("Error placing the order. Please try again.");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("An error occurred while placing the order.");
    }
  };

  const discountAmount = () => {
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    return Math.min((subtotal + deliveryFee) * (voucherDiscount / 100), maximumDiscount);
  };

  const calculateTotal = () => {
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    return subtotal + deliveryFee - discountAmount();
  };

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <ToastContainer />
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <div style={{color:'#ccc'}}>First Name: <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' /></div>
          <div>Last Name: <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' /></div>
        </div>
         <div>Email: <input required name='email' value={data.email} type="email" placeholder='Email address' readOnly /></div>
        <div className="multi-fields">
          <div>Gender: <input required name='gender' onChange={onChangeHandler} value={data.gender} type="text" placeholder='Gender' readOnly /></div>
          <div>ZipCode: <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' /></div>
        </div>
        <div className="multi-fields">
          <div>Phone: <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' /></div>
          <div>Address: <input required name='address' onChange={onChangeHandler} value={data.address} type="text" placeholder='Address' /></div>
        </div>
        <div className="cart-note">
          <label htmlFor="note">Add a note to your order:</label>
          <textarea id="note" name="note" value={data.note} onChange={onChangeHandler} placeholder="Enter your note here..."></textarea>
        </div>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Voucher: ({voucherDiscount}%)</p>
              <p>${discountAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <p>${calculateTotal()}</p>
            </div>
            <hr />
            <div className="cart-note">
              <label htmlFor="note">Note:</label>
              <p>{data.note}</p>
            </div>
          </div>
          <button type='submit'>PROCESS TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;