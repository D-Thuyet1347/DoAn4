import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';  // Import axios
import "./MyOrders.css";
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, {
        headers: { token }
      });
      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const response = await axios.delete(`${url}/api/order/${orderId}`, {
        headers: { token }
      });
      if (response.data.success) {
        setData(data.filter(order => order._id !== orderId));
        console.log("Order deleted successfully");
      } else {
        console.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items.map((item, idx) => {
                  return `${item.name} x ${item.quantity}` + (idx === order.items.length - 1 ? '' : ', ');
                })}
              </p>
              <p>${order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p><span>&#x25cf;</span> <b>{order.status}</b></p>
              <button onClick={fetchOrders}>Track Orders</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders;