import Location from '../models/Location';

class LocationController {
  async store(req, res, next) {
    const { latitude, longitude } = req.body;
    const { user } = req;
    const location = await Location.create({
      user_id: user.id,
      longitude,
      latitude,
    });

    user.location_id = location.id;
    await user.save();

    return next();
  }
}

export default new LocationController();
