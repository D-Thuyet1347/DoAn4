import jwt from 'jsonwebtoken';

export const authMiddlewareAvatar = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Lấy token từ header

    if (!token) {
        return res.status(401).json({ message: 'No token found. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Giải mã token
        req.user = decoded; // Lưu thông tin người dùng vào request object
        next(); // Tiếp tục vào controller
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};
