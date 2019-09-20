import * as Yup from 'yup';
import { Op } from 'sequelize';

import Comment from '../models/Comment';
import File from '../models/File';
import User from '../models/User';
import Wine from '../models/Wine';

class WineController {
  async index(req, res) {
    const { page = 1, country, vineyard, year } = req.query;
    const limit = 10;

    const wines = await Wine.findAll({
      where: {
        [Op.and]: [
          country ? { country } : null,
          vineyard ? { vineyard } : null,
          year ? { year } : null,
        ],
      },
      limit,
      offset: (page - 1) * limit,
      attributes: ['id', 'name', 'country', 'vineyard', 'year'],
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

  async show(req, res) {
    const wine = await Wine.findByPk(req.params.id, {
      include: [
        { model: File, as: 'image', attributes: ['id', 'path', 'url'] },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'comment'],
          include: [{ model: User, attributes: ['name'] }],
        },
      ],
      attributes: ['id', 'name', 'country', 'vineyard', 'year', 'description'],
    });

    if (!wine) {
      return res.status(404).json({ error: 'Wine not found.' });
    }

    return res.status(200).json(wine);
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
