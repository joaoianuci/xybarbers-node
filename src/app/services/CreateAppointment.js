import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import { enAU } from 'date-fns/locale';

import User from '../models/User';
import File from '../models/File';
import Location from '../models/Location';
import Address from '../models/Address';

import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import Service from '../models/Service';

class CreateAppointment {
  async run({ provider_id, user_id, service_id, date, res }) {
    if (provider_id === user_id) {
      return res
        .status(400)
        .json({ error: 'You cannot create appointments for yourself' });
    }
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(400)
        .json({ error: 'You can only create appointments with providers' });
    }
    const service = await Service.findByPk(service_id);
    if (!service) {
      return res.status(400).json({
        error: 'You can only create appointments with a valid service',
      });
    }
    if (!isProvider) {
      return res
        .status(400)
        .json({ error: 'You can only create appointments with providers' });
    }
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }
    const appointment = await Appointment.create({
      user_id,
      provider_id,
      service_id,
      date,
    });

    const user = await User.findByPk(user_id, {
      attributes: {
        exclude: [
          'password_hash',
          'password_reset_token',
          'password_reset_expires',
        ],
      },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
        {
          model: Location,
          as: 'point',
          attributes: ['id', 'longitude', 'latitude'],
        },
        {
          model: Address,
          as: 'address',
          attributes: [
            'id',
            'number',
            'street',
            'neighborhood',
            'city',
            'state',
          ],
        },
      ],
    });
    const formattedDate = format(
      hourStart,
      "'day' dd 'of' MMMM', at' H:mm'h'",
      { locale: enAU }
    );
    await Notification.create({
      content: `A '${service.name}' service was scheduled by ${user.name} at ${formattedDate}.`,
      user: {
        id: provider_id,
        name: user.name,
        avatar: user.avatar.url,
      },
    });
    return { appointment };
  }
}
export default new CreateAppointment();
