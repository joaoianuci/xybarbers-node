import { startOfHour, parseISO, format } from 'date-fns';
import { enAU } from 'date-fns/locale';
import Mail from '../lib/Mail';

export default {
  key: 'CancellationMail',
  options: {
    priority: 2,
  },
  async handle({ data }) {
    const { appointment } = data;
    const text = `Hello ${appointment.provider.name}`;
    const hourStart = startOfHour(parseISO(appointment.date));
    const formattedDate = format(
      hourStart,
      "'day' dd 'of' MMMM', at' H:mm'h'",
      { locale: enAU }
    );
    await Mail.sendMail({
      to: appointment.provider.email,
      from: 'XyBarbers <xybarbers@xybarbers.com.br>',
      template: 'cancellation',
      subject: 'Cancellation of you appointment',
      context: { text, date: formattedDate },
    });
  },
};
