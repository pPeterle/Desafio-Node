import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  async index(req, res) {
    const { id } = req.params;

    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: id,
      },
    });

    return res.json(problems);
  }

  async store(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Fields' });
    }

    const problem = await DeliveryProblem.create({
      delivery_id: id,
      description: req.body.description,
    });

    return res.json(problem);
  }

  async delete(req, res) {
    const { id } = req.params;

    await DeliveryProblem.destroy({ where: { id } });

    return res.json({ message: 'problem deleted' });
  }
}

export default new DeliveryProblemController();
