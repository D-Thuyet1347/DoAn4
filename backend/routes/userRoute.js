

import express from 'express';
import multer from 'multer';
import path from 'path';
import userModel from '../models/userModel.js'; // Đảm bảo bạn nhập khẩu userModel đúng cách
import { addUser, listUser, loginUser, registerUser, removeUser, updateUser, getUserInfo, changePassword } from '../controllers/userControllers.js';
import authMiddleware from '../middleware/auth2.js';

const userRouter = express.Router();

// Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars'); // Lưu ảnh vào thư mục 'uploads/avatars'
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Đặt tên file với timestamp để tránh trùng lặp
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Các định dạng file ảnh phổ biến
    const fileTypes = /jpeg|jpg|png|gif|bmp|tiff|webp|svg/; // Thêm các định dạng ảnh
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file ảnh với các định dạng: JPEG, JPG, PNG, GIF, BMP, TIFF, WEBP, SVG.'));
    }
  },
});

// Các route cũ
userRouter.post('/register', registerUser);
userRouter.get('/list', listUser);
userRouter.post('/remove', removeUser);
userRouter.post('/login', loginUser);
userRouter.post('/add', addUser);
userRouter.get('/:id', getUserInfo);
userRouter.put('/update/:id', updateUser);
userRouter.post('/change-password', authMiddleware, changePassword);

// Route mới để upload ảnh avatar
userRouter.post('/upload-avatar/:id', upload.single('avatar'), async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Không có file nào được upload.' });
  }

  try {
    const avatarPath = `uploads/avatars/${req.file.filename}`; // Đường dẫn lưu ảnh
    const user = await userModel.findByIdAndUpdate(id, { avatar: avatarPath }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    // Trả về URL đầy đủ của avatar để frontend có thể sử dụng
    const avatarUrl = `http://localhost:4000/${avatarPath}`; // Chỉnh lại URL tùy theo địa chỉ của server

    res.json({
      success: true,
      message: 'Ảnh avatar đã được upload thành công.',
      avatarUrl,  // Trả về URL đầy đủ của avatar
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server khi upload ảnh.' });
  }
});



// Route bổ sung để lấy URL avatar của người dùng
userRouter.get('/avatar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id);
    if (!user || !user.avatar) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy avatar hoặc người dùng.' });
    }

    const avatarUrl = `http://localhost:4000/${user.avatar}`; // Chỉnh lại URL tùy theo địa chỉ của server

    res.json({ success: true, avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy avatar.' });
  }
});

export default userRouter;