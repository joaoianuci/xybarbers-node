import * as Yup from 'yup';
import crypto from 'crypto';
import PasswordValidator from 'password-validator';
import User from '../models/User';
import File from '../models/File';
import Location from '../models/Location';
import Address from '../models/Address';

import Queue from '../lib/Queue';

class UserController {
  async store(req, res, next) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      provider: Yup.boolean(),
      phone: Yup.string().required(),
      number: Yup.number().required(),
      street: Yup.string().required(),
      neighborhood: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string()
        .length(2)
        .required(),
      longitude: Yup.number().required(),
      latitude: Yup.number().required(),
      bio: Yup.string(),
    });
    const passwordSchema = new PasswordValidator();

    passwordSchema
      .is()
      .min(6)
      .is()
      .max(20)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits()
      .has()
      .not()
      .spaces()
      .has()
      .symbols();

    if (!passwordSchema.validate(req.body.password)) {
      return res
        .status(400)
        .json({ error: 'Password is not satisfacting the requirements' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ where: { email: req.body.email } });
    }
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create(req.body);
    req.user = user;
    const { provider } = req.body;
    if (provider) {
      const token = crypto
        .randomBytes(3)
        .toString('hex')
        .toUpperCase();
      await user.update({ provider_token: token });
      await Queue.add('ProviderValidateMail', {
        user: { email: user.email, name: user.name },
        token,
      });
    }
    return next();
  }

  async show(req, res) {
    if (!req.userId) {
      return res
        .status(400)
        .json({ error: 'The user identifier not is valid' });
    }

    const user = await User.findByPk(req.userId, {
      attributes: {
        exclude: [
          'password_hash',
          'password_reset_token',
          'password_reset_expires',
        ],
      },
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
          attributes: [
            'id',
            'number',
            'street',
            'neighborhood',
            'city',
            'state',
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'The user not exists' });
    }

    return res.json(user);
  }

  async destroy(req, res) {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'The user not exists' });
    }

    await user.destroy();

    return res.status(200).json();
  }

  async update(req, res, next) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      number: Yup.number(),
      phone: Yup.string(),
      street: Yup.string(),
      neighborhood: Yup.string(),
      city: Yup.string(),
      bio: Yup.string(),
      longitude: Yup.number(),
      latitude: Yup.number(),
      password: Yup.string(),
      newPassword: Yup.string(),
    });
    const { password, newPassword } = req.body;
    const passwordSchema = new PasswordValidator();

    passwordSchema
      .is()
      .min(6)
      .is()
      .max(20)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits()
      .has()
      .not()
      .spaces()
      .has()
      .symbols();

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ where: { email: req.body.email } });
    }

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'O usuário não existe' });
    }

    if (!password && !newPassword) {
      await user.update(req.body);
      req.user = user;
      return next();
    }

    if (
      newPassword !== undefined &&
      !passwordSchema.validate(req.body.newPassword)
    ) {
      return res
        .status(400)
        .json({ error: 'Nova senha não satisfaz as condições necessárias' });
    }

    const check = await user.checkPassword(password);

    if (password !== undefined && !check) {
      return res
        .status(402)
        .json({ error: 'Falha na autenticação das senhas' });
    }
    req.body.password = newPassword;
    await user.update(req.body);

    req.user = user;
    return next();
  }
}

export default new UserController();
