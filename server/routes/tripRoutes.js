const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Day = require('../models/Day');
const Activity = require('../models/Activity');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, destination, startDate, endDate, budget, currency, coverImage } = req.body;

  try {
    const trip = await Trip.create({
      user: req.user._id,
      title,
      destination,
      startDate,
      endDate,
      budget,
      currency,
      coverImage,
      itinerary: req.body.itinerary || []
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all user trips
// @route   GET /api/trips
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get trip by ID
// @route   GET /api/trips/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('user', 'name email avatar');

    if (trip) {
      if (trip.user._id.toString() !== req.user._id.toString() && !trip.collaborators.includes(req.user._id)) {
        return res.status(401).json({ message: 'User not authorized' });
      }

      // Fetch days and activities for this trip
      const days = await Day.find({ trip: trip._id }).sort({ dayNumber: 1 });
      const activities = await Activity.find({ trip: trip._id }).sort({ time: 1 });

      // Build nested itinerary for frontend compatibility
      const itinerary = days.map(day => {
        const dayObj = day.toObject();
        dayObj.day = dayObj.dayNumber; // Frontend expects .day
        dayObj.activities = activities
          .filter(a => a.day.toString() === day._id.toString())
          .map(a => a.toObject());
        return dayObj;
      });

      res.json({ ...trip.toObject(), itinerary });
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check ownership or collaboration
    const isOwner = trip.user.equals(req.user._id);
    const isCollaborator = trip.collaborators.some(id => id.equals(req.user._id));

    if (!isOwner && !isCollaborator) {
      return res.status(401).json({ message: 'User not authorized to update this trip' });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedTrip);
  } catch (error) {
    console.error('Update Trip Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Helper function to get full trip with itinerary
const getFullTrip = async (tripId) => {
  const trip = await Trip.findById(tripId).populate('user', 'name email avatar');
  if (!trip) return null;

  const days = await Day.find({ trip: tripId }).sort({ dayNumber: 1 });
  const activities = await Activity.find({ trip: tripId }).sort({ time: 1 });

  const itinerary = days.map(day => {
    const dayObj = day.toObject();
    dayObj.day = dayObj.dayNumber;
    dayObj.activities = activities
      .filter(a => a.day.toString() === day._id.toString())
      .map(a => a.toObject());
    return dayObj;
  });

  return { ...trip.toObject(), itinerary };
};

// @desc    Add a day to itinerary
// @route   POST /api/trips/:id/days
// @access  Private
router.post('/:id/days', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (!trip.user.equals(req.user._id) && !trip.collaborators.includes(req.user._id)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { date, day } = req.body;
    await Day.create({ trip: trip._id, dayNumber: day, date });

    const fullTrip = await getFullTrip(trip._id);
    res.status(201).json(fullTrip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a day from itinerary
// @route   DELETE /api/trips/:id/days/:dayIndex
// @access  Private
router.delete('/:id/days/:dayIndex', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (!trip.user.equals(req.user._id) && !trip.collaborators.includes(req.user._id)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const days = await Day.find({ trip: trip._id }).sort({ dayNumber: 1 });
    const dayIndex = parseInt(req.params.dayIndex);

    if (dayIndex >= 0 && dayIndex < days.length) {
      const dayToDelete = days[dayIndex];
      
      // Delete activities for this day
      await Activity.deleteMany({ day: dayToDelete._id });
      // Delete the day
      await Day.findByIdAndDelete(dayToDelete._id);
      
      // Re-index remaining days
      const remainingDays = await Day.find({ trip: trip._id }).sort({ dayNumber: 1 });
      for (let i = 0; i < remainingDays.length; i++) {
        remainingDays[i].dayNumber = i + 1;
        await remainingDays[i].save();
      }
      
      const fullTrip = await getFullTrip(trip._id);
      res.json(fullTrip);
    } else {
      res.status(400).json({ message: 'Invalid day index' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add an activity to a day
// @route   POST /api/trips/:id/days/:dayIndex/activities
// @access  Private
router.post('/:id/days/:dayIndex/activities', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (!trip.user.equals(req.user._id) && !trip.collaborators.includes(req.user._id)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const days = await Day.find({ trip: trip._id }).sort({ dayNumber: 1 });
    const dayIndex = parseInt(req.params.dayIndex);

    if (dayIndex >= 0 && dayIndex < days.length) {
      const { title, time, location, notes, estimatedCost } = req.body;
      await Activity.create({
        day: days[dayIndex]._id,
        trip: trip._id,
        title,
        time,
        location,
        notes,
        estimatedCost: estimatedCost || 0
      });
      
      const fullTrip = await getFullTrip(trip._id);
      res.status(201).json(fullTrip);
    } else {
      res.status(400).json({ message: 'Invalid day index' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete an activity
// @route   DELETE /api/trips/:id/days/:dayIndex/activities/:activityIndex
// @access  Private
router.delete('/:id/days/:dayIndex/activities/:activityIndex', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (!trip.user.equals(req.user._id) && !trip.collaborators.includes(req.user._id)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const days = await Day.find({ trip: trip._id }).sort({ dayNumber: 1 });
    const dayIndex = parseInt(req.params.dayIndex);

    if (dayIndex >= 0 && dayIndex < days.length) {
      const activities = await Activity.find({ day: days[dayIndex]._id }).sort({ time: 1 });
      const activityIndex = parseInt(req.params.activityIndex);

      if (activityIndex >= 0 && activityIndex < activities.length) {
        await Activity.findByIdAndDelete(activities[activityIndex]._id);
        const fullTrip = await getFullTrip(trip._id);
        res.json(fullTrip);
      } else {
        res.status(400).json({ message: 'Invalid activity index' });
      }
    } else {
      res.status(400).json({ message: 'Invalid day index' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get trip expenses
// @route   GET /api/trips/:id/expenses
// @access  Private
router.get('/:id/expenses', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ trip: req.params.id })
      .populate('paidBy', 'name email avatar')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add expense to trip
// @route   POST /api/trips/:id/expenses
// @access  Private
router.post('/:id/expenses', protect, async (req, res) => {
  try {
    const { description, amount, category, date, paidBy } = req.body;
    const expense = await Expense.create({
      trip: req.params.id,
      description,
      amount,
      category,
      date,
      paidBy: paidBy || req.user._id
    });
    
    const populatedExpense = await Expense.findById(expense._id).populate('paidBy', 'name email avatar');
    res.status(201).json(populatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
