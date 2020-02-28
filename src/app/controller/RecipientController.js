import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const recipients = await Recipient.findAll();

    return res.json(recipients);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Fields' });
    }

    const recipient = await Recipient.create(req.body);

    return res.status(201).json(recipient);
  }

  async update(req, res) {
    const { id } = req.params;

    const isRecipientId = await Recipient.findByPk(id);

    if (!isRecipientId) {
      return res.status(400).json({ error: 'id does not exists' });
    }

    delete req.body.id;
    await Recipient.update(req.body, { where: { id } });

    const recipientUpdated = await Recipient.findByPk(id);
    return res.status(201).json(recipientUpdated);
  }

  async delete(req, res) {
    const { id } = req.params;

    const isRecipientId = await Recipient.findByPk(id);

    if (!isRecipientId) {
      return res.status(400).json({ error: 'id does not exists' });
    }

    await Recipient.destroy({
      where: { id },
    });

    return res.json({ message: 'Recipient Deleted' });
  }
}

export default new RecipientController();
