const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Đảm bảo userId là bắt buộc
    },
    avatarUrl: {
        type: String,
        required: true, // Đảm bảo rằng mỗi avatar có URL
    },
}, { timestamps: true }); // Tạo thêm các trường createdAt và updatedAt

// Tạo model Avatar
const Avatar = mongoose.model('Avatar', avatarSchema);

module.exports = Avatar;
