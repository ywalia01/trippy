const tripService = require('../services/tripService');
const Trip=require('../models/Trips');

// tripController.js


exports.getAllTrips = async (req, res) => {
  const allTrips = await tripService.getAllTrips();
  res.status(200).json(allTrips);
};

exports.getTrip = async (req, res) => {
  id = req.params.id;
  const requestedTrip = await tripService.getTrip(id);
  res.status(200).json(requestedTrip);
};

exports.createTrip = async (req, res) => {
  const { title, source, destination, startDate, endDate, price, itinerary, images } = req.body;
  const capacity = req.body.occupancy;
  let amenities;

  try {
    amenities = JSON.parse(req.body.amenities);
  } catch (error) {
    console.error('Error parsing amenities:', error);
    return res.status(400).json({ msg: 'Invalid amenities format' });
  }

  if (!title || !source || !destination || !startDate || !endDate || !price || !capacity || !itinerary || !images || !amenities) {
    console.log('Missing required fields');
    return res.status(400).json({ msg: 'Please enter all the details!!' });
  }

  if (req.user.role !== 'agent') {
    console.log('Unauthorized access attempt by:', req.user.email);
    return res.status(403).json({ msg: 'Unauthorized: Only agents can create trips.' });
  }
  const agentId = req.user._id;

  try {
    const tripData = {
      title,
      source,
      destination,
      startDate,
      endDate,
      price,
      capacity,
      itinerary,
      amenities,
      images,
      agentId
    };

    console.log("Calling tripService.createTrip with data:", tripData);
    const newTrip = await tripService.createTrip(tripData);
    console.log("Trip created successfully:", newTrip);

    res.status(201).json(newTrip);
  } catch (error) {
    console.error('Error while creating trip:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};




exports.getTripsByAgent = async (req, res) => {
  try {
      const agentId = req.user._id;

      const trips = await Trip.find({ agentId });

      res.status(200).json(trips);
  } catch (error) {
      console.error('Error fetching trips by agent:', error);
      res.status(500).json({ msg: 'Server error' });
  }
};



exports.getTripById = async (req, res) => {
  try {
      const tripId = req.params.id;
      const trip = await Trip.findById(tripId);

      if (!trip) {
          return res.status(404).json({ msg: 'Trip not found' });
      }

      res.status(200).json(trip);
  } catch (error) {
      console.error('Error fetching trip details:', error);
      res.status(500).json({ msg: 'Server error' });
  }
};


exports.editTrip = async (req, res) => {
  const tripId = req.params.id;
  const { title, source, destination, startDate, endDate, price, itinerary, images } = req.body;
  const capacity = req.body.occupancy;
  let amenities;

  try {
      amenities = JSON.parse(req.body.amenities);
  } catch (error) {
      console.error('Error parsing amenities:', error);
      return res.status(400).json({ msg: 'Invalid amenities format' });
  }

  if (!title || !source || !destination || !startDate || !endDate || !price || !capacity || !itinerary || !images || !amenities) {
      console.log('Missing required fields');
      return res.status(400).json({ msg: 'Please enter all the details!!' });
  }

  if (req.user.role !== 'agent') {
      console.log('Unauthorized access attempt by:', req.user.email);
      return res.status(403).json({ msg: 'Unauthorized: Only agents can edit trips.' });
  }

  const agentId = req.user._id;

  try {
      const tripData = {
          title,
          source,
          destination,
          startDate,
          endDate,
          price,
          capacity,
          itinerary,
          amenities,
          images,
          agentId
      };

      console.log("Calling tripService.editTrip with data:", tripData);
      const updatedTrip = await Trip.findByIdAndUpdate(tripId, tripData, { new: true });

      if (!updatedTrip) {
          return res.status(404).json({ msg: 'Trip not found' });
      }

      console.log("Trip updated successfully:", updatedTrip);
      res.status(200).json(updatedTrip);
  } catch (error) {
      console.error('Error while editing trip:', error);
      res.status(500).json({ msg: 'Server error' });
  }
};

exports.filterTrips = async (req, res) => {
  const { source, destination, startDate, endDate } = req.body;

  try {
    const trips = await tripService.filterTrips({ source, destination, startDate, endDate });
    res.status(200).json(trips);
  } catch (error) {
    console.error("Error while filtering trips:", error.message);
    res.status(500).json({ message: error.message });
  }
};
