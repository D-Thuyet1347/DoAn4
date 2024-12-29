import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  maximumDiscount: {
    type: Number,
    required: true,
  },
  minimumAmount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number,
    required: true,
  },
  usageLeft: {
    type: Number,
    required: true,
  },
});

const Voucher = mongoose.model('Voucher', voucherSchema);

export default Voucher;