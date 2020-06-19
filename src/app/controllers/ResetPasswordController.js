import * as Yup from 'yup';
import User from '../models/User';

class ResetPasswordController {
  async store(req, res) {
    const { token } = req.headers;
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
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (token !== user.password_reset_token)
        return res.status(402).json({ error: 'Token invalid' });
      const now = new Date();

      if (now > user.password_reset_expires)
        return res
          .status(402)
          .json({ error: 'Token expired, generate a new one' });

      await user.update({
        password_reset_expires: null,
        password_reset_token: null,
        password: req.body.password,
      });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Cannot reset password, try again' });
    }
    return res.json({ message: 'Password was reset with success' });
  }
}
export default new ResetPasswordController();
