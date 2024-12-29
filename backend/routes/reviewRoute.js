import express from 'express';
import { addReview, getReviewsByProduct, removeReview } from '../controllers/reviewController.js';
import authMiddleware from '../middleware/auth.js';

const reviewRouter = express.Router();

// Route thêm đánh giá
reviewRouter.post('/add', addReview);

// Route lấy đánh giá theo productId
reviewRouter.get('/:productId', getReviewsByProduct);
reviewRouter.delete('/remove/:id', removeReview);

export default reviewRouter;