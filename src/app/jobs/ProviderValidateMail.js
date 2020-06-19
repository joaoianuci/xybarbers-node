import Mail from '../lib/Mail';

export default {
  key: 'ProviderValidateMail',
  options: {
    priority: 2,
  },
  async handle({ data }) {
    const { user, token } = data;

    const text = `Hello ${user.name}`;

    await Mail.sendMail({
      to: user.email,
      from: 'XyBarbers <xybarbers@xybarbers.com.br>',
      template: 'provider_validate',
      subject: 'Validate your provider account',
      context: { text, token },
    });
  },
};
