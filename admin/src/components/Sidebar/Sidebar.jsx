import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
          <img className='push' src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink  to='/list' className="sidebar-option">
          <img  className='push' src={assets.order_icon} alt="" />
          <p>List Items</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
          <img  className='push' src={assets.order} alt="" />
          <p>Orders</p>
        </NavLink>
        <NavLink to='/statiscal' className="sidebar-option">
          <img  className='push' src={assets.tt} alt="" />
          <p>Statiscal</p>
        </NavLink>
        <NavLink to='/user' className="sidebar-option">
          <img  className='push' src={assets.user} alt="" />
          <p>User</p>
        </NavLink>
        <NavLink to='/vouchers' className="sidebar-option">
          <img  className='push' src={assets.voucher} alt="" />
          <p>vouchers</p>
        </NavLink>
        <NavLink to='/voucher-list' className="sidebar-option">
          <img  className='push' src={assets.voucher} alt="" />
          <p>Voucher Lists</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
