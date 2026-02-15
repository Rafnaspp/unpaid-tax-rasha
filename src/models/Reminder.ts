import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  taxpayerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  reminderDate: {
    type: Date,
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Reminder || mongoose.model('Reminder', ReminderSchema);
