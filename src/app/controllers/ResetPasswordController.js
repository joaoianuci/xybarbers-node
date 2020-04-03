import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import User from '../models/User';

class ResetPasswordController {
  // eslint-disable-next-line consistent-return
  async store(req, res) {
    const { token } = req.query;
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6)
        .max(35),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ where: { email: req.body.email } });
    }
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) return res.status(404).send({ error: 'User not found' });
      if (token !== user.password_reset_token)
        return res.status(402).send({ error: 'Token invalid' });
      const now = new Date();

      if (now > user.password_reset_expires)
        return res
          .status(402)
          .send({ error: 'Token expired, generate a new one' });

      const hash = await bcrypt.hash(req.body.password, 8);

      await user.update({
        password_reset_expires: null,
        password_reset_token: null,
        password: hash,
      });
    } catch (err) {
      return res
        .status(400)
        .send({ error: 'Cannot reset password, try again' });
    }
    return res.send({ message: 'Password was reset with success' });
  }
}
export default new ResetPasswordController();
