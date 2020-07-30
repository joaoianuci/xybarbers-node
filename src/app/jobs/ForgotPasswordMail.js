import Mail from '../lib/Mail';

export default {
  key: 'ForgotPasswordMail',
  options: {
    priority: 1,
  },
  async handle({ data }) {
    const { user, token } = data;
    const text = `Hello ${user.name}`;
    await Mail.sendMail({
      to: user.email,
      from: 'XyBarbers <xybarbers@xybarbers.com.br>',
      template: 'forgot_password',
      subject: 'Reset your password',
      context: { text, token },
    });
  },
};
