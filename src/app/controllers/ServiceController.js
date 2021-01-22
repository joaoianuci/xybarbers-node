import * as Yup from 'yup';
import Service from '../models/Service';
import User from '../models/User';

class ServiceController {
  async store(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().required().uppercase(),
      name: Yup.string().required(),
      description: Yup.string().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Os campos estão inválidos' });
    }
    const provider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!provider) {
      return res.status(404).json({ error: 'Profissional não existe' });
    }
    const checkServiceExists = await Service.findOne({
      where: { name: req.body.name, user_id: provider.id },
    });
    if (checkServiceExists) {
      return res.status(400).json({
        error: `O '${checkServiceExists.name}' serviço já existe`,
      });
    }
    const service = await Service.create({ ...req.body, user_id: provider.id });
    return res.json(service);
  }

  async update(req, res) {
    const { name, description, price } = req.body;
    const provider = await User.findByPk(req.userId);
    if (!provider) {
      return res.status(404).json({ error: 'Usuário não existe' });
    }
    const service = await Service.findOne({ where: { id: req.params.service_id, user_id: provider.id } });
    await service.update({ name, description, price });
    return res.json(service);
  }

  async index(req, res) {
    const provider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!provider) {
      return res.status(404).json({ error: 'Profissional não existe' });
    }
    const services = await Service.findAll({ where: { user_id: provider.id } });
    return res.json(services);
  }
  
  async show(req, res) {
     const provider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!provider) {
      return res.status(404).json({ error: 'Profissional não existe' });
    }
    const service = await Service.findOne({ where: { id: req.params.service_id} });
    return res.json(service);
  }

  async destroy(req, res) {
    const provider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!provider) {
      return res.status(404).json({ error: 'Profissional não existe' });
    }
    await Service.destroy({ where: { id: req.params.service_id } });
    return res.status(200).json();
  }
}

export default new ServiceController();
