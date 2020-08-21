import Service from '../models/Service';
import User from '../models/User';

class ServiceController {
  async store(req, res) {
    const { description, price } = req.body;
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not exists' });
    }
    const service = await Service.create({
      user_id: user.id,
      description,
      price,
    });

    return res.json(service);
  }

  async update(req, res) {
    const { description, price } = req.body;
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not exists' });
    }
    const service = await Service.findOne({ where: { user_id: user.id } });
    service.update({ description, price });
    return res.json(service);
  }

  async index(req, res) {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not exists' });
    }
    const services = await Service.find({ where: { user_id: user.id } });
    return res.json(services);
  }

  async destroy(req, res) {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not exists' });
    }
    await Service.destroy({ where: { id: req.service_id } });
    return res.json();
  }
}

export default new ServiceController();
