import User from '../models/User';

class UserController {
  async store(req, res) {
    const checkUser = await User.findOne({ where: { email: req.body.email } });

    if (checkUser) {
      return res
        .status(400)
        .json({ error: 'This email has already registered. ' });
    }

    const { id, name, email, admin } = await User.create(req.body);

    return res.status(201).json({ id, name, email, admin });
  }
}

export default new UserController();
