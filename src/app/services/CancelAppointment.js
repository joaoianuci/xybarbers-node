import { isBefore, subHours } from 'date-fns';

import User from '../models/User';
import Appointment from '../models/Appointment';
import Queue from '../lib/Queue';

class CancelAppointment {
  async run({ provider_id, user_id, res }) {
    const appointment = await Appointment.findOne({
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      where: {
        provider_id,
        user_id,
      },
    });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not was founded.' });
    }
    if (user_id !== appointment.user_id) {
      res
        .status(400)
        .json({ message: 'User identifier not equal with appointment user.' });
    }
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      res.status(400).json({
        message: 'You can only cancel appointments 2 hours in advance.',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();
    await Queue.add('CancellationMail', { appointment });
    return appointment;
  }
}
export default new CancelAppointment();
