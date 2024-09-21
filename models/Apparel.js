const mongoose = require('mongoose');

const apparelSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  location: String,
  contactEmail: String,
  disposalMethod: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  imageUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Apparel', apparelSchema);
