import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';
import generateToken from '../utils/generateToken';

class AuthenticateController {
  async store(req, res, next) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
        .max(35),
    });

    const { password, email } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ where: { email } });
    }


    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    if (!user) {
      return res.status(401).send({ error: 'User not found' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).send({ error: 'Invalid password' });
    }

    const { id, name, avatar, provider } = user;

    return res.json({
      user: {
        id,
        name,
        avatar,
        provider,
      },
      token: generateToken({ id: user.id }),
    });
  }
}

export default new AuthenticateController();
