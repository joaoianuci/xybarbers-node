import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import { enAU } from 'date-fns/locale';

import User from '../models/User';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

class CreateAppointment {
  async run({ provider_id, user_id, date, res }) {
    if (provider_id === user_id) {
      res
        .status(400)
        .json({ message: 'You cannot create appointments for yourself' });
    }
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      res
        .status(400)
        .json({ message: 'You can only create appointments with providers' });
    }

    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      res.status(400).json({ message: 'Past dates are not permitted' });
    }
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (checkAvailability) {
      res.status(400).json({ message: 'Appointment date is not available' });
    }
    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date,
    });

    const user = await User.findByPk(user_id);
    const formattedDate = format(
      hourStart,
      "'day' dd 'of' MMMM', at' H:mm'h'",
      { locale: enAU }
    );

    await Notification.create({
      content: `Scheduled by ${user.name} at ${formattedDate}.`,
      user: provider_id,
    });

    return { appointment };
  }
}
export default new CreateAppointment();
