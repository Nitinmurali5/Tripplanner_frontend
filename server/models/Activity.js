const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
  day: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Day'
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Trip'
  },
  time: String,
  title: {
    type: String,
    required: true
  },
  location: String,
  estimatedCost: {
    type: Number,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
