import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  resolvedAt: { type: Date },
  resolvedBy: { type: String },
  reopenedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Support = mongoose.models.Support || mongoose.model('Support', supportSchema);

export default Support;
