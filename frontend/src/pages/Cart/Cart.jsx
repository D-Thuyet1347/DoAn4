
import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, addTocart, voucherCode, setVoucherCode, setcartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0); // State for voucher discount percentage
  const [maximumDiscount, setMaximumDiscount] = useState(0); // State for maximum discount
  const [appliedVoucher, setAppliedVoucher] = useState("");
  const [note, setNote] = useState(""); // State for note

  const handleVoucherSubmit = async () => {
    if (!voucherCode) {
      setMessage("Please enter voucher code.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/vouchers/code/${voucherCode}`);
      if (response.ok) {
        const data = await response.json();
        const currentDate = new Date();
        const voucherStartDate = new Date(data.startDate);
        const voucherEndDate = new Date(data.endDate);
        const subtotal = getTotalCartAmount();

        if (subtotal < data.minimumAmount) {
          setMessage(`The order must have a minimum value of ${data.minimumAmount} USD to apply this voucher.`);
        } else if (currentDate < voucherStartDate) {
          setMessage(`This voucher will be valid from ${voucherStartDate.toLocaleDateString()}.`);
        } else if (currentDate > voucherEndDate) {
          setMessage("This voucher has expired.");
        } else if (data.usageLeft >= data.usageLimit){
          setMessage("The voucher's usable quantity has expired.");
        }else {
          // Tăng số lượng sử dụng của voucher
          const updateResponse = await fetch(`http://localhost:4000/api/vouchers/redeem/${voucherCode}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (updateResponse.ok) {
            setVoucherDiscount(data.discount);
            setMaximumDiscount(data.maximumDiscount); // Set the maximum discount
            setAppliedVoucher(voucherCode);
            setVoucherCode("");
            setMessage("Voucher applied successfully!");
          } else {
            const updateData = await updateResponse.json();
            setMessage(updateData.message || "Failed to redeem the voucher.");
          }
        }
      } else {
        setMessage("Voucher does not exist.");
      }
    } catch (error) {
      setMessage("Error connecting to the server.");
    }
  };

  const discountAmount = () => {
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    const discountAmount = Math.min((subtotal + deliveryFee) * (voucherDiscount / 100), maximumDiscount);
    return discountAmount;
  };

  const calculateTotal = () => {
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    const total = subtotal + deliveryFee - discountAmount();
    return total;
  };

  const handleCheckout = () => {
    if (getTotalCartAmount() === 0) {
      toast.error('Your cart is empty.', { autoClose: 1000 });
      return;
    }
    navigate('/order', { state: { voucherCode, voucherDiscount, maximumDiscount, note } });
  };

  const handleRemoveItem = (itemId) => {
    const toastId = toast(
      <div className="toast-confirmation">
        <p>Are you sure you want to remove this item?</p>
        <div className="button-group">
          <button
            className="confirm-button"
            onClick={() => {
              setcartItems((prev) => {
                const updatedCart = { ...prev };
                delete updatedCart[itemId];
                return updatedCart;
              });
              toast.dismiss(toastId);
              toast.success('Item removed successfully!', { autoClose: 1000 });
            }}
          >
            Confirm
          </button>
          <button
            className="cancel-button"
            onClick={() => {
              toast.dismiss(toastId);
              toast.info('Cancelled!', { autoClose: 1000 });
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: 'top-right',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  return (
    <div className="cart">
      <ToastContainer />
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <div className="quantity">
                    <p onClick={() => removeFromCart(item._id)} className="cross">
                      -
                    </p>
                    <p>{cartItems[item._id]}</p>
                    <p onClick={() => addTocart(item._id)} className="cross">
                      +
                    </p>
                  </div>
                  <p>{item.price * cartItems[item._id]}</p>
                  <p onClick={() => handleRemoveItem(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}

        <div className="cart-bottom">
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
                <label htmlFor="note">Add a note to your order:</label>
                <textarea
                  id="note"
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter your note here..."
                ></textarea>
              </div>
            </div>
            <button onClick={handleCheckout}>PROCESS TO CHECKOUT</button>
          </div>
          <div className="cart-promocode">
            <div>
              <p>If you have a voucher code, enter it here</p>
              <div className="cart-promocode-input">
                <input
                  type="text"
                  placeholder="voucher code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <button onClick={handleVoucherSubmit}>Submit</button>
              </div>
              {message && <p>{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;