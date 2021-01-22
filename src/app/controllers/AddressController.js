import Address from '../models/Address';

class AddressController {
  async store(req, res, next) {
    const { number, street, neighborhood, city, state } = req.body;
    const { user } = req;
    const address = await Address.create({
      user_id: user.id,
      number,
      street,
      neighborhood,
      city,
      state,
    });
    user.address_id = address.id;
    await user.save();

    return next();
  }

  async update(req, res, next) {
    const { number, street, neighborhood, city, state } = req.body;
    const { user } = req;
    const address = await Address.findOne({ where: { user_id: user.id } });
    await address.update({ number, street, neighborhood, city, state });

    return next();
  }
}

export default new AddressController();
