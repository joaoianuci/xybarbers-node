import File from '../models/File';
import User from '../models/User';
import Location from '../models/Location';
import Address from '../models/Address';
import generateToken from '../utils/generateToken';

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

    const filteredUser = user.filteredUser(user);

    return res.json({
      user: filteredUser,
      token: generateToken({ id: user.id }),
    });
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
        {
          model: Address,
          as: 'address',
          attributes: ['id', 'number', 'street', 'neighborhood', 'city', 'state'],
        }
      ],
    });
    const filteredUser = updateUser.filteredUser(updateUser);
    return res.json(filteredUser);
  }
}

export default new FileController();
