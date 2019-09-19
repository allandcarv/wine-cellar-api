import * as Yup from 'yup';

import Wine from '../models/Wine';

class WineController {
  async store(req, res) {
    if (!req.admin) {
      return res.status(401).json({ error: 'You are not allowed.' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      country: Yup.string().required(),
      vineyard: Yup.string().required(),
      year: Yup.string().required(),
      image_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Data Input Validation Failed. ' });
    }

    const wine = await Wine.create(req.body);

    return res.status(201).json(wine);
  }
}

export default new WineController();
