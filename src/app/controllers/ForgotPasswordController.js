import * as Yup from 'yup';
import crypto from 'crypto';
import mailer from '../../modules/mailer';
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
    const text = `Hello ${user.name}`;
    mailer.sendMail(
      {
        to: email,
        from: process.env.MAIL_USER,
        template: './auth/forgot_password',
        subject: 'Reset your password',
        context: { text, token },
      },
      // eslint-disable-next-line consistent-return
      err => {
        if (err) {
          return res
            .status(400)
            .send({ error: 'Cannot send forgot password email' });
        }
        return res
          .status(200)
          .send({ message: 'E-mail successfully sent', token });
      }
    );
  }
}
export default new ForgotPasswordController();
