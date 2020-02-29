import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliverymanActionsController {
  async show(req, res) {
    const { id } = req.params;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        end_date: null,
        canceled_at: null,
      },
    });

    return res.json(deliveries);
  }

  async index(req, res) {
    const { id } = req.params;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        end_date: {
          [Op.ne]: null,
        },
      },
    });

    return res.json(deliveries);
  }

  async update1(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Fields' });
    }

    const { start_date } = req.body;
    const { id } = req.params;

    if (isBefore(parseISO(start_date), new Date())) {
      return res.status(400).json({ error: 'Date must be after today' });
    }

    const delivery = await Delivery.findByPk(id);
    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: delivery.deliveryman_id,
      },
    });
    if (deliveries.length < 5) {
      await Delivery.update({ start_date }, { where: { id } });
    } else {
      return res.stauts(400).json({ error: 'Deliveryman can only takes 5' });
    }

    const deliveryUpdated = await Delivery.findByPk(id);
    return res.json(deliveryUpdated);
  }

  async update2(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.string().required(),
      signature_id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Fields' });
    }

    const { id } = req.params;
    const { end_date, signature_id } = req.body;

    await Delivery.update({ end_date, signature_id }, { where: { id } });
    const deliveryUpdated = await Delivery.findByPk(id, {
      include: { model: File, as: 'signature' },
    });

    return res.json(deliveryUpdated);
  }
}

export default new DeliverymanActionsController();
