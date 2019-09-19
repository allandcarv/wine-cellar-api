import * as Yup from 'yup';

import File from '../models/File';
import Wine from '../models/Wine';

class WineController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const limit = 10;

    const wines = await Wine.findAll({
      limit,
      offset: (page - 1) * limit,
      attributes: ['id', 'name', 'country', 'vineyard', 'year', 'description'],
      include: [
        {
          model: File,
          as: 'image',
          attributes: ['path', 'url'],
        },
      ],
    });

    return res.status(200).json(wines);
  }

  async store(req, res) {
    if (!req.admin) {
      return res.status(401).json({ error: 'You are not allowed.' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      country: Yup.string().required(),
      vineyard: Yup.string().required(),
      year: Yup.string().required(),
      description: Yup.string()
        .max(500)
        .required(),
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
