import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VoucherList.css';

function VoucherList() {
  const [vouchers, setVouchers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [editFormData, setEditFormData] = useState({
    code: '',
    discount: '',
    maximumDiscount: '',
    minimumAmount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    usageLeft: '',
  });

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/vouchers');
        if (response.ok) {
          const data = await response.json();
          setVouchers(data);
        } else {
          console.error('Error fetching vouchers.');
        }
      } catch (error) {
        console.error('Error connecting to server:', error);
      }
    };

    fetchVouchers();
  }, []);

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher._id);
    setEditFormData({
      code: voucher.code,
      discount: voucher.discount,
      maximumDiscount: voucher.maximumDiscount,
      minimumAmount: voucher.minimumAmount,
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      usageLimit: voucher.usageLimit,
      usageLeft: voucher.usageLeft,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = (id) => {
    const toastId = toast(
      <div>
        <p>Confirm deletion of this voucher?</p>
        <button
          onClick={async () => {
            await confirmDelete(id, toastId); // Gọi confirmDelete để xử lý xóa
          }}
          style={{ marginRight: '10px' }}
        >
          Confirm
        </button>
        <button onClick={() => toast.dismiss(toastId)}>Cancel</button>
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
  
  const confirmDelete = async (id, toastId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/vouchers/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Sau khi xóa thành công, cập nhật lại danh sách voucher trong state
        setVouchers((prevVouchers) => {
          return prevVouchers.filter((voucher) => voucher._id !== id);
        });
        toast.dismiss(toastId);
        toast.success('Voucher has been successfully deleted!', {
          autoClose: 3000,
        });
      } else {
        toast.error('Error deleting voucher.');
      }
    } catch (error) {
      toast.error('Error connecting to server.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/vouchers/${editingVoucher}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
  
      if (response.ok) {
        const updatedVoucher = await response.json();
        setVouchers((prevVouchers) =>
          prevVouchers.map((voucher) =>
            voucher._id === editingVoucher ? updatedVoucher : voucher
          )
        );
        setEditingVoucher(null);
        toast.success('Voucher updated successfully!');
      } else {
        toast.error('Error updating voucher.');
      }
    } catch (error) {
      toast.error('Error connecting to the server.');
    }
  };

  const filteredVouchers = vouchers.filter((voucher) => {
    const query = searchQuery.toLowerCase();
    return (
      voucher.code.toLowerCase().includes(query) ||
      voucher.discount.toString().includes(query) ||
      voucher.maximumDiscount.toString().includes(query) ||
      voucher.minimumAmount.toString().includes(query) ||
      voucher.usageLeft.toString().includes(query) ||
      voucher.usageLimit.toString().includes(query) ||
      new Date(voucher.startDate).toLocaleDateString().toLowerCase().includes(query) ||
      new Date(voucher.endDate).toLocaleDateString().toLowerCase().includes(query)
    );
  });


  return (
    <div className="container">
      <h2>Voucher List</h2>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <input
          style={{ marginBottom: '20px', width: '500px' }}
          type="text"
          placeholder="Search by code"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <label style={{lineHeight: '50px', marginRight: '30px'}}>Total Vouchers: {filteredVouchers.length}</label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount(%)</th>
            <th>Max Discount(USD)</th>
            <th>Min Order Value</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Usage Limit</th>
            <th>Used</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVouchers.map((voucher) => (
            <tr key={voucher._id}>
              <td>{voucher.code}</td>
              <td>{voucher.discount}</td>
              <td>{voucher.maximumDiscount}</td> {/* Hiển thị Giảm tối đa */}
              <td>{voucher.minimumAmount}</td>
              <td>{new Date(voucher.startDate).toLocaleString()}</td>
              <td>{new Date(voucher.endDate).toLocaleString()}</td>
              <td>{voucher.usageLimit}</td>  {/* Hiển thị số lượt sử dụng */}
              <td>{voucher.usageLeft || 0}</td>   {/* Hiển thị số lượng còn lại */}
              <td className="sua-xoa">
                <button onClick={() => handleEdit(voucher)}>Edit</button>
                <button onClick={() => handleDelete(voucher._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingVoucher && (
        <div className="edit-form">
          <form onSubmit={handleEditSubmit}>
            <label>
              Voucher Code:
              <input
                type="text"
                name="code"
                value={editFormData.code}
                onChange={handleEditChange}
                required
              />
            </label>
            <label>
              Discount:
              <input
                type="number"
                name="discount"
                value={editFormData.discount}
                onChange={handleEditChange}
                required
              />
            </label>
            <label>
              Maximum Discount(USD):
              <input
                type="number"
                name="maximumDiscount"
                value={editFormData.maximumDiscount}
                onChange={handleEditChange}
                required
              />
            </label>
            <label>
              Minimum Order Value:
              <input
                type="number"
                name="minimumAmount"
                value={editFormData.minimumAmount}
                onChange={handleEditChange}
                required
              />
            </label>
            <label>
              Start Date:
              <input
                type="datetime-local"
                name="startDate"
                value={new Date(editFormData.startDate).toISOString().slice(0, 16)}
                onChange={handleEditChange}
                required
              />
            </label>
            <label>
              End Date:
              <input
                type="datetime-local"
                name="endDate"
                value={new Date(editFormData.endDate).toISOString().slice(0, 16)}
                onChange={handleEditChange}
                required
              />
            </label>
            <label>
              Usage Limit:
              <input
                type="number"
                name="usageLimit"
                value={editFormData.usageLimit}
                onChange={handleEditChange}
                required
              />
            </label>
            <div className="btn">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingVoucher(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default VoucherList;