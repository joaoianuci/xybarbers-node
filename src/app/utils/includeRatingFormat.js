import User from '../models/User';
import File from '../models/File';

const includeRating = {
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
    {
      model: User,
      as: 'user',
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
};

export default includeRating;
