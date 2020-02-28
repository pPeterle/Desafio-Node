import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliveryman = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email'],
      include: [{ model: File, as: 'avatar' }],
    });

    return res.json(deliveryman);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Fields' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async update(req, res) {
    const { id } = req.params;

    const isDeliverymanId = await Deliveryman.findByPk(id);

    if (!isDeliverymanId) {
      return res.status(400).json({ error: 'id does not exists' });
    }

    delete req.body.id;

    await Deliveryman.update(req.body, { where: { id } });
    const deliverymanUpdated = await Deliveryman.findByPk(id);

    return res.json(deliverymanUpdated);
  }

  async delete(req, res) {
    const { id } = req.params;

    const isDeliverymanId = await Deliveryman.findByPk(id);

    if (!isDeliverymanId) {
      return res.status(400).json({ error: 'id does not exists' });
    }

    await Deliveryman.destroy({
      where: { id },
    });

    return res.json({ message: 'Deliveryman Deleted' });
  }
}

export default new DeliverymanController();
