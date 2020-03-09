import * as Yup from 'yup';
import User from '../models/User';

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
}

export default new UserController();
