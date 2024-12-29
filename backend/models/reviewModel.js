import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Liên kết tới sản phẩm
  rating: { type: Number, required: true, min: 1, max: 5 }, // Số sao đánh giá
  comment: { type: String, required: true }, // Nội dung bình luận
  firstName: { type: String, required: true }, // Họ của người đánh giá
  date: { type: Date, default: Date.now }, // Thời gian đánh giá
});

const Review = mongoose.model('Review', reviewSchema);

export default Review; // Xuất module Review