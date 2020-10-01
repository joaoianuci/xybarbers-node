import * as Yup from 'yup';
import Service from '../models/Service';
import User from '../models/User';

class ServiceController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'The fields are incorrect' });
    }
    const provider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!provider) {
      return res.status(404).json({ error: 'Provider not exists' });
    }
    const checkServiceExists = await Service.findOne({
      where: { name: req.body.name },
    });
    if (checkServiceExists) {
      return res.status(400).json({
        error: `The '${checkServiceExists.name}' service already exists`,
      });
    }
    const service = await Service.create({ ...req.body, user_id: provider.id });
    return res.json(service);
  }

  async update(req, res) {
    const { description, price } = req.body;
    const provider = await User.findByPk(req.userId);
    if (!provider) {
      return res.status(404).json({ error: 'User not exists' });
    }
    const service = await Service.findOne({ where: { user_id: provider.id } });
    service.update({ description, price });
    return res.json(service);
  }

  async index(req, res) {
    const provider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!provider) {
      return res.status(404).json({ error: 'Provider not exists' });
    }
    const services = await Service.find({ where: { user_id: provider.id } });
    return res.json(services);
  }

  async destroy(req, res) {
    const provider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!provider) {
      return res.status(404).json({ error: 'Provider not exists' });
    }
    await Service.destroy({ where: { id: req.params.service_id } });
    return res.status(200).json();
  }
}

export default new ServiceController();
