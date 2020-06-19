import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications.' });
    }
    const notifications = await Notification.find({ user: req.userId }).sort({
      creadtedAt: 'desc',
    });
    return res.json(notifications);
  }

  async read(req, res) {
    const { notification_id } = req.params;
    if (!notification_id) {
      return res
        .status(404)
        .json({ message: 'The notification identifier not is valid.' });
    }
    const notification = await Notification.findByIdAndUpdate(
      notification_id,
      {
        $set: { read: true },
      },
      { useFindAndModify: false }
    );
    notification.read = true;
    return res.json(notification);
  }
}

export default new NotificationController();
