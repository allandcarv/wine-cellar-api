import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
      confirmPassword: Yup.string()
        .required()
        .oneOf([Yup.ref('password')]),
      admin: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Data Input Validation Failed ' });
    }

    const checkUser = await User.findOne({ where: { email: req.body.email } });

    if (checkUser) {
      return res
        .status(400)
        .json({ error: 'This email has already been registered. ' });
    }

    const { id, name, email, admin } = await User.create(req.body);

    return res.status(201).json({ id, name, email, admin });
  }
}

export default new UserController();
