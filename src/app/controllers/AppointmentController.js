import * as Yup from 'yup';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

import CreateAppointment from '../services/CreateAppointment';
import CancelAppointment from '../services/CancelAppointment';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    const { provider_id, date } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ message: 'The user identifier not is valid' });
    }

    const { appointment } = await CreateAppointment.run({
      provider_id,
      user_id: req.userId,
      date,
      res,
    });
    return res.json(appointment);
  }

  async destroy(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
    });

    const { provider_id } = req.params;
    if (
      !(await schema.isValid({
        user_id: req.userId,
        provider_id: req.params.provider_id,
      }))
    ) {
      return res
        .status(400)
        .json({ message: 'The user identifier not is valid' });
    }
    const appointment = await CancelAppointment.run({
      provider_id,
      user_id: req.userId,
      res,
    });
    return res.json(appointment);
  }
}

export default new AppointmentController();
