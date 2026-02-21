import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  taxpayerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  refundStatus: {
    type: String,
    enum: ['none', 'partial', 'full'],
    default: 'none'
  },
  razorpayRefundId: {
    type: String,
    sparse: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  mode: {
    type: String,
    enum: ['online', 'manual'],
    required: true
  },
  razorpayPaymentId: {
    type: String,
    sparse: true
  },
  razorpayOrderId: {
    type: String,
    sparse: true
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
