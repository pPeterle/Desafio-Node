import * as Yup from 'yup';
import { isBefore, isAfter, parseISO } from 'date-fns';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      include: [
        { model: Recipient, as: 'recipient' },
        { model: Deliveryman, as: 'deliveryman' },
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      // start_date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Fields' });
    }

    delete req.body.id;
    const delivery = await Delivery.create(req.body);

    return res.status(201).json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Fields' });
    }

    const { id } = req.params;

    const idExists = await Delivery.findByPk(id);
    if (!idExists) return res.status(400).json({ error: 'id does not exists' });

    delete req.body.id;
    const { startDate, endDate } = req.body;
    if (startDate || endDate)
      return res
        .status(400)
        .json({ error: 'You cannot update the delivery status in this path' });

    await Delivery.update(req.body, { where: { id } });
    const deliveryUpdated = await Delivery.findByPk(id);
    return res.json(deliveryUpdated);
  }

  async delete(req, res) {
    const { id } = req.params;

    const idExists = await Delivery.findByPk(id);

    if (!idExists) return res.status(400).json({ error: 'id does not exists' });

    await Delivery.destroy({ where: { id } });

    return res.json({ message: 'Delivery deleted' });
  }
}

export default new DeliveryController();
