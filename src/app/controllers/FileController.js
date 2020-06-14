import File from '../models/File';
import User from '../models/User';
import Location from '../models/Location';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const { user } = req;
    const file = await File.create({
      user_id: user.id,
      name,
      path,
    });

    user.avatar_id = file.id;

    await user.save();

    user.password_hash = undefined;
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;

    return res.json(user);
  }

  async update(req, res, next) {
    const { originalname: name, filename: path } = req.file;
    const { user } = req;
    const file = await File.findOne({ where: { user_id: user.id } });
    await file.update({
      name,
      path,
    });
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

    updateUser.password_hash = undefined;

    return res.json(updateUser);
  }
}

export default new FileController();
