import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setcartItems] = useState({});
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [maximumDiscount, setMaximumDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState("");
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const addTocart = async (itemId) => {
    setcartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setcartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });
    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        } else {
          console.error(`Không tìm thấy sản phẩm với ID: ${item}`);
        }
      }
    }
    return totalAmount;
  };

  const calculateTotal = () => {
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    const discountAmount = Math.min(
      (subtotal + deliveryFee) * (voucherDiscount / 100),
      maximumDiscount
    );
    return subtotal + deliveryFee - discountAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thực phẩm:", error);
    }
  };

  const loadCartData = async (userToken) => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token: userToken } });
      setcartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu giỏ hàng:", error);
      setcartItems({});
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setIsLoggedIn(false);
    setcartItems({});
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      if (token) {
        await loadCartData(token);
      }
    };
    loadData();
  }, [token]);

  const contextValue = {
    food_list,
    cartItems,
    setcartItems,
    addTocart,
    removeFromCart,
    getTotalCartAmount,
    calculateTotal,
    url,
    token,
    setToken,
    isLoggedIn,
    setIsLoggedIn,
    logout,
    voucherCode,
    setVoucherCode,
    voucherDiscount,
    setVoucherDiscount,
    maximumDiscount,
    setMaximumDiscount,
    appliedVoucher,
    setAppliedVoucher,
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;