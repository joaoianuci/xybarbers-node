import * as Yup from 'yup';
import crypto from 'crypto';
import Queue from '../lib/Queue';
import User from '../models/User';

class ForgotPasswordController {
  // eslint-disable-next-line consistent-return
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ where: { email: req.body.email } });
    }
    const { email } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
      attributes: {
        include: ['password_reset_token', 'password_reset_expires'],
      },
    });

    if (!user) return res.status(400).send({ error: 'User not found' });
    const token = crypto
      .randomBytes(3)
      .toString('hex')
      .toUpperCase();
    const now = new Date();
    now.setHours(now.getHours() + 1);
    await user.update({
      password_reset_expires: now,
      password_reset_token: token,
    });
    await Queue.add('ForgotPasswordMail', {
      user: { email, name: user.name },
      token,
    });

    return res.json();
  }
}
export default new ForgotPasswordController();
