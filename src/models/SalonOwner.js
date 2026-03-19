import mongoose from 'mongoose';

const salonOwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  salonType: { type: String, enum: ['Female', 'Male', 'Unisex'], required: true },
  services: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    description: { type: String }
  }],
  offers: [{
    title: { type: String, required: true },
    description: { type: String },
    discount: { type: Number, required: true },
    validUntil: { type: Date }
  }],
  salonImage: { type: String }, // Base64 string or file path
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SalonOwner = mongoose.models.SalonOwner || mongoose.model('SalonOwner', salonOwnerSchema);

export default SalonOwner;
