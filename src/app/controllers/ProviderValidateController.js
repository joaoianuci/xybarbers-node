import User from '../models/User';

class ProviderValidateController {
  async store(req, res) {
    const { token } = req.headers;
    const provider = await User.findByPk(req.userId, { provider: true });
    if (!provider) {
      return res.status(404).json({ error: 'The provider not exists' });
    }
    const { provider_validate, provider_token } = provider;
    if (provider_validate) {
      return res.status(400).json({ error: 'This provider already validate' });
    }
    if (provider_token !== token) {
      return res.status(402).json({ error: 'Token invalid' });
    }
    provider.update({ provider_validate: true, provider_token: null });
    provider.save();

    const filteredProvider = provider.filteredUser(provider);

    return res.json(filteredProvider);
  }
}
export default new ProviderValidateController();
