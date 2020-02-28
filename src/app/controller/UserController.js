import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('nome obrigatorio'),
      email: Yup.string().required('email obrigatorio'),
      password: Yup.string().required('senha obrigatoria'),
    });

    try {
      schema.validateSync(req.body);
      const user = await User.create(req.body);
      return res.json(user);
    } catch (error) {
      return res.status(400).json({error: error.message});
    }

  }

  async index(req, res) {
    const users = await User.findAll();
    return res.json(users);
  }
}

export default new UserController();
