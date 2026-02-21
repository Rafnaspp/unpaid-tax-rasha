import mongoose from 'mongoose';

const AssessmentSchema = new mongoose.Schema({
  taxpayerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taxpayerName: {
    type: String,
    required: true,
    trim: true
  },
  financialYear: {
    type: String,
    required: true,
    trim: true
  },
  halfYearIncome: {
    type: Number,
    required: true,
    min: 0
  },
  slabName: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  balance: {
    type: Number,
    required: true,
    min: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['unpaid', 'partially_paid', 'paid'],
    default: 'unpaid'
  }
}, {
  timestamps: true
});

export default mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);
