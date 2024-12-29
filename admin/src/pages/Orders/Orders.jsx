import React, { useState, useEffect } from 'react';
import './Orders.css';
import { toast } from "react-toastify";
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchAllOrders = async () => {
        const response = await axios.get(url + "/api/order/list");
        if (response.data.success) {
            setOrders(response.data.data);
        } else {
            toast.error("error");
        }
    };

    const statusHandler = async (event, orderId) => {
        const response = await axios.post(url + "/api/order/status", {
            orderId,
            status: event.target.value
        });
        if (response.data.success) {
            await fetchAllOrders();
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const filteredOrders = orders.filter(order =>
        order.address?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address?.phone?.includes(searchQuery)
    );

    return (
        <div className='order add'>
            <h3>Order Page</h3>
            <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="order-list">
                {filteredOrders.map((order, index) => (
                    <div key={index} className="order-item">
                        <img className='od' src={assets.parcel_icon} alt="" />
                        <div>
                            <p className='order-item-food'>
                              Food Name:  {order.items.map((item, index) => {
                                    if (index === order.items.length - 1) {
                                        return " | " +item.name  + " x " + item.quantity + " | ";
                                    } else {
                                        return " | " + item.name + " x " + item.quantity + " | ";
                                    }
                                })}
                            </p>
                            <p className='order-item-name'>Full Name:  {order.address?.firstName + " " + order.address?.lastName}</p>
                            <div className="order-item-address">
                                <p>Address:  { order?.address?.address }</p>
                                <p>Gender:  {order?.address?.gender }</p>  
                                <p>Zipcode:  {order?.address?.zipcode}</p>
                            </div>
                            <p className='order-item-phone'>Phone:  {order?.address?.phone}</p>
                        </div>
                        <div>
                        <p>Items: {order.items.length}</p>
                        </div>
                        <p>Price$: {order.amount}</p>
                        <select onChange={(even) => statusHandler(even, order._id)} value={order.status}>
                            <option value="Food Processing">Food Processing</option>
                            <option value="Cancel Order">Cancel Order</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;