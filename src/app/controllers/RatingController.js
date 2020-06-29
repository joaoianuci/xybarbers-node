import * as Yup from 'yup';
import sequelize from 'sequelize';
import Rating from '../models/Rating';
import User from '../models/User';
import includeRating from '../utils/includeRatingFormat';

class RatingController {
  async store(req, res) {
    const schema = Yup.object().shape({
      rating: Yup.number()
        .required()
        .min(1)
        .max(5),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ where: { rating: req.body.rating } });
    }
    const userCheck = await User.findByPk(req.userId);
    if (!userCheck) {
      return res.status(404).json({ error: 'User not exists' });
    }
    const providerCheck = await User.findByPk(req.params.provider_id);
    if (!providerCheck) {
      return res.status(404).json({ error: 'Provider not exists' });
    }
    const ratingCheck = await Rating.findOne({
      where: {
        rated_id: providerCheck.id,
        rater_id: userCheck.id,
      },
      include: includeRating.include,
    });
    if (ratingCheck) {
      return res.json(ratingCheck);
    }

    const rating = await Rating.create({
      rating: req.body.rating,
      rated_id: providerCheck.id,
      rater_id: userCheck.id,
    });

    if (!rating) {
      return res
        .status(400)
        .json({ error: 'Not was possible create rating resource' });
    }
    const ratingUpdated = await rating.reload({
      include: includeRating.include,
    });

    return res.json(ratingUpdated);
  }

  async index(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number()
        .required()
        .integer(),
    });
    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ where: { rating: req.body.rating } });
    }
    const providerCheck = await User.findByPk(req.params.provider_id);
    if (!providerCheck) {
      return res.status(404).json({ error: 'Provider not exists' });
    }

    const ratings = await Rating.findAll({
      where: {
        rated_id: providerCheck.id,
      },
      include: includeRating.include,
      order: ['createdAt'],
    });
    const getAvgRating = await Rating.findAll({
      where: {
        rated_id: providerCheck.id,
      },
      attributes: [
        [sequelize.fn('avg', sequelize.col('rating')), 'rating_avg'],
      ],
    });
    if (!ratings) {
      return res.status(404).json({ error: 'Ratings of provider not exists' });
    }
    const ratingAvg = Number(getAvgRating[0].dataValues.rating_avg).toFixed(2);

    return res.json({ ratings, ratingAvg });
  }
}

export default new RatingController();
