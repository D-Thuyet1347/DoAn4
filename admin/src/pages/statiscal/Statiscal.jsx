// import React, { useState, useEffect } from 'react';
// import './Statiscal.css';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
// import { format, parseISO } from 'date-fns';

// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// const Statiscal = ({ url }) => {
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [topItems, setTopItems] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [filterType, setFilterType] = useState("month"); // Default: "month"

//   const fetchAllOrders = async () => {
//     try {
//       const response = await axios.get(url + "/api/order/list");
//       if (response.data.success) {
//         const ordersData = response.data.data;

//         // Tổng số đơn hàng và doanh thu
//         setTotalOrders(ordersData.length);
//         const revenue = ordersData.reduce((sum, order) => sum + order.amount, 0);
//         setTotalRevenue(revenue);

//         // Thống kê món bán chạy
//         const itemCount = {};
//         ordersData.forEach(order => {
//           if (order.items && Array.isArray(order.items)) {
//             order.items.forEach(item => {
//               if (itemCount[item.name]) {
//                 itemCount[item.name] += item.quantity;
//               } else {
//                 itemCount[item.name] = item.quantity;
//               }
//             });
//           }
//         });

//         const sortedItems = Object.entries(itemCount)
//           .sort((a, b) => b[1] - a[1])
// .map(([name, quantity]) => ({ name, quantity }));
//         setTopItems(sortedItems);

//         // Lưu dữ liệu gốc để lọc theo ngày/tháng/năm
//         setFilteredData(ordersData);
//       } else {
//         toast.error("Failed to fetch orders");
//       }
//     } catch (error) {
//       toast.error("Error fetching orders");
//     }
//   };

//   useEffect(() => {
//     fetchAllOrders();
//   }, []);

//   // Xử lý dữ liệu nhóm theo ngày/tháng/năm
//   const getGroupedData = () => {
//     const revenueGroup = {};
//     filteredData.forEach(order => {
//       if (order.data) {
//         let groupKey;

//         // Nhóm theo loại thời gian (ngày, tháng, năm)
//         switch (filterType) {
//           case "day":
//             groupKey = format(parseISO(order.data), "yyyy-MM-dd");
//             break;
//           case "month":
//             groupKey = format(parseISO(order.data), "yyyy-MM");
//             break;
//           case "year":
//             groupKey = format(parseISO(order.data), "yyyy");
//             break;
//           default:
//             groupKey = format(parseISO(order.data), "yyyy-MM");
//         }

//         if (revenueGroup[groupKey]) {
//           revenueGroup[groupKey] += order.amount;
//         } else {
//           revenueGroup[groupKey] = order.amount;
//         }
//       }
//     });

//     return Object.entries(revenueGroup)
//       .sort(([keyA], [keyB]) => new Date(keyA) - new Date(keyB))
//       .map(([key, revenue]) => ({ group: key, revenue }));
//   };

//   const groupedData = getGroupedData();

//   // Dữ liệu biểu đồ
//   const chartData = {
//     labels: groupedData.map(data => data.group),
//     datasets: [
//       {
//         label: `Revenue (${filterType === "day" ? "Daily" : filterType === "month" ? "Monthly" : "Yearly"})`,
//         data: groupedData.map(data => data.revenue),
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Tùy chỉnh biểu đồ
//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Revenue (USD)',
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: filterType === "day" ? "Days" : filterType === "month" ? "Months" : "Years",
//         },
//       },
//     },
//   };

//   return (
//     <div className="statiscal-report">
//       {/* Cột bên trái */}
//       <div className="report-left">
//         <h3>Statistical Report</h3>
//         <div className="report-summary">
//           <p>Total Orders: <strong>{totalOrders}</strong></p>
//           <p>Total Revenue: <strong>${totalRevenue.toFixed(2)}</strong></p>
//         </div>
  
//         <div className="top-items">
//           <h4>Best Sale</h4>
//           {topItems.length > 0 ? (
//             <table className="best-sale-table">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Product Name</th>
// <th>Quantity Sold</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {topItems.map((item, index) => (
//                   <tr key={index}>
//                     <td>{index + 1}</td>
//                     <td>{item.name}</td>
//                     <td>{item.quantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No sales data available</p>
//           )}
//         </div>
//       </div>
  
//       {/* Cột bên phải */}
//       <div className="report-right">
//         <div className="revenue-chart">
//           <h4>Revenue by {filterType === "day" ? "Day" : filterType === "month" ? "Month" : "Year"}</h4>
//           {groupedData.length > 0 ? (
//             <Bar data={chartData} options={chartOptions} />
//           ) : (
//             <p>No revenue data available for the selected period</p>
//           )}
//         </div>
      
  
//       {/* Bộ chọn ngày/tháng/năm dưới biểu đồ */}
//       <div className="filter-options">
//         <label>
//           <input
//             type="radio"
//             value="day"
//             checked={filterType === "day"}
//             onChange={(e) => setFilterType(e.target.value)}
//           />
//           By Day
//         </label>
//         <label>
//           <input
//             type="radio"
//             value="month"
//             checked={filterType === "month"}
//             onChange={(e) => setFilterType(e.target.value)}
//           />
//           By Month
//         </label>
//         <label>
//           <input
//             type="radio"
//             value="year"
//             checked={filterType === "year"}
//             onChange={(e) => setFilterType(e.target.value)}
//           />
//           By Year
//         </label>
//       </div>
//       </div>
//     </div>
//   );
  
// };

// export default Statiscal;



import React, { useState, useEffect } from 'react';
import './Statiscal.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { format, parseISO } from 'date-fns';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Statiscal = ({ url }) => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topItems, setTopItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterType, setFilterType] = useState("month"); // Default: "month"
  const [startDate, setStartDate] = useState(null); // Lưu ngày bắt đầu
  const [endDate, setEndDate] = useState(null); // Lưu ngày kết thúc

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        const ordersData = response.data.data;

        // Tổng số đơn hàng và doanh thu
        setTotalOrders(ordersData.length);
        const revenue = ordersData.reduce((sum, order) => sum + order.amount, 0);
        setTotalRevenue(revenue);

        // Thống kê món bán chạy
        const itemCount = {};
        ordersData.forEach(order => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
              if (itemCount[item.name]) {
                itemCount[item.name] += item.quantity;
              } else {
                itemCount[item.name] = item.quantity;
              }
            });
          }
        });

        const sortedItems = Object.entries(itemCount)
          .sort((a, b) => b[1] - a[1])
          .map(([name, quantity]) => ({ name, quantity }));
        setTopItems(sortedItems);

        // Lưu dữ liệu gốc để lọc theo ngày/tháng/năm
        setFilteredData(ordersData);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Xử lý dữ liệu nhóm theo ngày/tháng/năm trong khoảng thời gian
  const getGroupedData = () => {
    const revenueGroup = {};
    filteredData.forEach(order => {
      if (order.data) {
        const orderDate = parseISO(order.data);
        let groupKey;

        // Kiểm tra nếu đơn hàng nằm trong khoảng thời gian đã chọn
        if (
          (startDate && orderDate < startDate) || 
          (endDate && orderDate > endDate)
        ) {
          return;
        }

        // Nhóm theo loại thời gian (ngày, tháng, năm)
        switch (filterType) {
          case "day":
            groupKey = format(orderDate, "yyyy-MM-dd");
            break;
          case "month":
            groupKey = format(orderDate, "yyyy-MM");
            break;
          case "year":
            groupKey = format(orderDate, "yyyy");
            break;
          default:
            groupKey = format(orderDate, "yyyy-MM");
        }

        if (revenueGroup[groupKey]) {
          revenueGroup[groupKey] += order.amount;
        } else {
          revenueGroup[groupKey] = order.amount;
        }
      }
    });

    return Object.entries(revenueGroup)
      .sort(([keyA], [keyB]) => new Date(keyA) - new Date(keyB))
      .map(([key, revenue]) => ({ group: key, revenue }));
  };

  const groupedData = getGroupedData();

  // Dữ liệu biểu đồ
  const chartData = {
    labels: groupedData.map(data => data.group),
    datasets: [
      {
        label: `Revenue (${filterType === "day" ? "Daily" : filterType === "month" ? "Monthly" : "Yearly"})`,
        data: groupedData.map(data => data.revenue),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Tùy chỉnh biểu đồ
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (USD)',
        },
      },
      x: {
        title: {
          display: true,
          text: filterType === "day" ? "Days" : filterType === "month" ? "Months" : "Years",
        },
      },
    },
  };

  return (
    <div className="statiscal-report">
      {/* Cột bên trái */}
      <div className="report-left">
        <h3>Statistical Report</h3>
        <div className="report-summary">
          <p>Total Orders: <strong>{totalOrders}</strong></p>
          <p>Total Revenue: <strong>${totalRevenue.toFixed(2)}</strong></p>
        </div>
  
        <div className="top-items">
          <h4>Best Sale</h4>
          {topItems.length > 0 ? (
            <table className="best-sale-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Quantity Sold</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No sales data available</p>
          )}
        </div>
      </div>
  
      {/* Cột bên phải */}
      <div className="report-right">
        <div className="revenue-chart">
          <h4>Revenue by {filterType === "day" ? "Day" : filterType === "month" ? "Month" : "Year"}</h4>
          {groupedData.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <p>No revenue data available for the selected period</p>
          )}
        </div>
        


        {/* Date Range Picker */}
        <div className="date-range">
          <label>Start Date: </label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy/MM/dd"
            placeholderText="Select start date"
          />
          <label>End Date: </label>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy/MM/dd"
            placeholderText="Select end date"
          />
        </div>
      </div>
    </div>
  );
};

export default Statiscal;
