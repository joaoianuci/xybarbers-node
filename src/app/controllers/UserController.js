import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';
import Location from '../models/Location';

class UserController {
  async store(req, res, next) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
        .max(35),
      number: Yup.number().required(),
      street: Yup.string().required(),
      neighborhood: Yup.string().required(),
      city: Yup.string().required(),
      longitude: Yup.number().required(),
      latitude: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ where: { email: req.body.email } });
    }
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists. ' });
    }

    const user = await User.create(req.body);
    req.user = user;

    return next();
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
    });
    if (!(await schema.isValid(req.params))) {
      return res
        .status(400)
        .json({ message: 'The user identifier not is valid' });
    }

    const user = await User.findByPk(req.params.user_id, {
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

    if (!user) {
      return res.status(404).json({ message: 'The user not exists' });
    }

    return res.json(user);
  }

  async destroy(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res
        .status(400)
        .json({ message: 'The user identifier not is valid' });
    }

    const user = await User.findByPk(req.params.user_id);
    if (!user) {
      return res.status(404).json({ message: 'The user not exists' });
    }

    await user.destroy();

    return res.status(200).json();
  }
}

export default new UserController();
