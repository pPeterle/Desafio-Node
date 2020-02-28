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

    return res.json(delivery);
  }

  async delete(req, res) {
    const { id } = req.params;

    const idExists = Delivery.findByPk(id);

    if (!idExists) return res.status(400).json({ error: 'id does not exists' });

    await Delivery.destroy({ where: { id } });

    return res.json({ message: 'Delivery deleted' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.string(),
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Fields' });
    }

    const { id } = req.params;
    const { end_date } = req.body;

    const atualDate = parseISO(end_date);

    const eightHour = new Date().setHours(8);
    const eightteenHour = new Date().setHours(18);

    if (isBefore(atualDate, eightHour) || isAfter(atualDate, eightteenHour)) {
      return res
        .status(400)
        .json({ error: 'Retirada so podem ser feitas entre as 8 e 18 hrs' });
    }

    await Delivery.update(req.body, { where: { id } });
    const deliveryUpdated = await Delivery.findByPk();
    return res.json(deliveryUpdated);
  }
}

export default new DeliveryController();
