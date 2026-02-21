import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  ward: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['taxpayer'],
    default: 'taxpayer'
  },
  resetPasswordToken: {
    type: String,
    default: undefined
  },
  resetPasswordExpires: {
    type: Date,
    default: undefined
  }
}, {
  timestamps: true
});

// Compare password method (no hashing)
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return candidatePassword === this.password;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
