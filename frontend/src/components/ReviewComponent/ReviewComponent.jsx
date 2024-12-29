import React, { useState, useEffect, useContext } from 'react';
import './ReviewComponent.css'; // CSS tùy chỉnh
import LoginPopup from '../LoginPopup/LoginPopup'; // Popup đăng nhập
import { StoreContext } from '../../context/StoreContext'; // Import StoreContext để lấy trạng thái đăng nhập
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const ReviewComponent = ({ productId }) => {
  const { isLoggedIn } = useContext(StoreContext); // Lấy thông tin đăng nhập từ StoreContext
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // Trạng thái popup đăng nhập
  const [loading, setLoading] = useState(true);

  const [customerData, setCustomerData] = useState({
    firstName: '',
  });

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token', e);
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
    const fetchUserData = async () => {
      if (!userId) {
        toast.error('User ID not found');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:4000/api/user/${userId}`);
        if (response.data.success) {
          setCustomerData(response.data.data);
        } else {
          toast.error('Failed to fetch user data');
        }
      } catch (err) {
        console.error('An error occurred while fetching user data:', err);
        toast.error('An error occurred while fetching user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Lấy danh sách đánh giá từ backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:4000/reviews/${productId}`);
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setShowLoginPopup(true); 
      return; 
    }

    if (rating < 1 || comment.trim() === '') {
      toast.error('Please provide a valid rating');
      return;
    }

    const newReview = { productId, rating, comment, userId };
    try {
      const response = await fetch('http://localhost:4000/reviews/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      const data = await response?.json();
      if (data.success) {
        setReviews([data?.review, ...reviews]); // Cập nhật danh sách đánh giá mới
        setRating(0);
        setComment('');
        toast.success('Review added successfully');
      } else {
        toast.error('Failed to add review');
      }
    } catch (error) {
      toast.error('An error occurred while adding your review.');
    }
  };

  // Xóa đánh giá
  const handleRemoveReview = async (reviewId) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true); 
      return; 
    }

    try {
      const response = await fetch(`http://localhost:4000/reviews/remove/${reviewId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setReviews(reviews.filter((review) => review._id !== reviewId));
        toast.success('Review removed successfully');
      } else {
        toast.error('Failed to delete review');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the review.');
    }
  };

  return (
    <div className="review-component">
      <h2>Product Reviews</h2>
      <ToastContainer />
      {/* Form Thêm Đánh Giá */}
      {isLoggedIn && (
        <form onSubmit={handleAddReview} className="review-form">
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  cursor: 'pointer',
                  fontSize: '24px',
                  color: star <= rating ? '#FFD700' : '#ccc',
                }}
              >
                {star <= rating ? '★' : '☆'}
              </span>
            ))}
          </div>
          <textarea
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit">Submit Review</button>
        </form>
      )}

      {/* Danh Sách Đánh Giá */}
      <div className="review-list">
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <p>
                <strong>Name: </strong> {review.firstName}
              </p>
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} style={{ color: star <= review.rating ? '#FFD700' : '#ccc' }}>
                   {star <= review.rating ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <p>
                <strong>Comment:</strong> {review.comment}
              </p>
              
              <p>
                <small>Reviewed on: {new Date(review.date).toLocaleString()}</small>
              </p>
              {/* Chỉ hiển thị nút Remove nếu đã đăng nhập */}
              {isLoggedIn && (
                <button
                  onClick={() => handleRemoveReview(review._id)}
                  className="remove-button"
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Popup Đăng Nhập */}
      {showLoginPopup && <LoginPopup setShowLogin={setShowLoginPopup} />}
    </div>
  );
};

export default ReviewComponent;