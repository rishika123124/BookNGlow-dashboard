import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'salon_owner', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'blocked', 'deleted'], default: 'active' },
  isEmailVerified: { type: Boolean, default: false },
  bookings: [{
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon' },
    service: { type: String },
    price: { type: Number },
    date: { type: Date },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

