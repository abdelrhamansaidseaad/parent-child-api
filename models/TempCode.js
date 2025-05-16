const mongoose = require('mongoose');
const { generateRandomCode } = require('../utils/helpers');

const tempCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    default: () => generateRandomCode(),
    unique: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ساعة
  },
  used: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('TempCode', tempCodeSchema);