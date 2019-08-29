import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExiste = await User.findOne({ where: { email: req.body.email } });

    if (userExiste) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const { id, name, email, provider } = await User.create(req.body);
    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    console.log(req.userId);
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExiste = await User.findOne({ where: { email } });

      if (userExiste) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha não confere' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
