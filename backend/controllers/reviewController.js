import Review from '../models/reviewModel.js';
import User from '../models/userModel.js'; // Import user model

export const addReview = async (req, res) => {
  const { productId, rating, comment, userId } = req.body; // Ensure userId is included in the request body

  try {
    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newReview = new Review({
      productId,
      rating,
      comment,
      firstName: user.firstName, // Include lastName from user data
    });

    await newReview.save(); // Lưu vào MongoDB
    res.status(201).json({ success: true, message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ success: false, message: 'Failed to add review' });
  }
};

// Lấy tất cả đánh giá của một sản phẩm
export const getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ productId }).sort({ date: -1 }); // Lấy tất cả review theo productId
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

export const removeReview = async (req, res) => {
  const { id } = req.params;

  try {
    await Review.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Review removed successfully' });
  } catch (error) {
    console.error('Error removing review:', error);
    res.status(500).json({ success: false, message: 'Failed to remove review' });
  }
};