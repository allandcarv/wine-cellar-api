import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Data Input Validation Failed.' });
    }

    const user = await User.findOne({ where: { email: req.body.email } });
    let checkPassword = null;

    if (user) {
      checkPassword = await user.checkPassword(req.body.password);
    }

    if (!user || !checkPassword) {
      return res.status(401).json({ error: 'User or Password invalid.' });
    }

    const { id, name, email, admin } = user;

    return res.status(201).json({
      id,
      name,
      email,
      admin,
      token: jwt.sign({ id, admin }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
