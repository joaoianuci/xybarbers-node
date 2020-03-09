import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const { user } = req;
    const file = await File.create({
      user_id: user.id,
      name,
      path,
    });

    user.avatar_id = file.id;

    await user.save();

    user.password_hash = undefined;

    return res.json(user);
  }
}

export default new FileController();
