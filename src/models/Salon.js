import mongoose from 'mongoose';

const salonSchema = new mongoose.Schema({
  salonName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  area: { type: String }, // Added for better location search
  gender: { type: String, enum: ['male', 'female', 'unisex'], required: true },
  contactInfo: { type: String, required: true }, 
  openingTime: { type: String, required: true }, 
  closingTime: { type: String, required: true }, 
  services: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String },
    description: { type: String }
  }],
  offers: [{
    title: { type: String, required: true },
    discount: { type: Number, required: true },
    description: { type: String },
    validDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  }],
  serviceImages: [{ type: String }],
  galleryImages: [{ type: String }],
  salonImage: { type: String }, // Main salon image
  phoneVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'deleted'], default: 'pending' },
  isActive: { type: Boolean, default: false }, // Inactive until approved
  isPremium: { type: Boolean, default: false },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  rejectionReason: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for better query performance
salonSchema.index({ email: 1 });
salonSchema.index({ location: 1 });
salonSchema.index({ area: 1 });
salonSchema.index({ gender: 1 });
salonSchema.index({ status: 1 });
salonSchema.index({ isActive: 1 });
salonSchema.index({ salonName: 'text', location: 'text', area: 'text' }); // Text search index
salonSchema.index({ createdAt: -1 });
salonSchema.index({ userId: 1 });

const Salon = mongoose.models.Salon || mongoose.model('Salon', salonSchema);

export default Salon;
