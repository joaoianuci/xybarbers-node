import Location from '../models/Location';
import User from '../models/User';
import File from '../models/File';

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

  async update(req, res, next) {
    const { latitude, longitude } = req.body;
    const { user } = req;
    const location = await Location.findOne({ where: { user_id: user.id } });
    location.update({ latitude, longitude });
    if (!req.file) {
      const updateUser = await User.findByPk(user.id, {
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
          {
            model: Location,
            as: 'point',
            attributes: ['id', 'longitude', 'latitude'],
          },
        ],
      });
      const filteredUser = updateUser.filteredUser(updateUser);
      return res.json(filteredUser);
    }
    return next();
  }
}

export default new LocationController();
