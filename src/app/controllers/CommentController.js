import * as Yup from 'yup';

import Comment from '../models/Comment';
import Wine from '../models/Wine';

class CommentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      comment: Yup.string()
        .max(500)
        .required(),
      wine_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Data Input Validation Failed.' });
    }

    req.body.user_id = req.userId;
    const wine = await Wine.findByPk(req.body.wine_id, { attributes: ['id'] });

    if (!wine) {
      return res.status(404).json({ error: 'Wine not found.' });
    }

    const comment = await Comment.create(req.body);

    return res.status(201).json(comment);
  }
}

export default new CommentController();
