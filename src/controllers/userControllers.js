const knex = require('./../database');
const bcrypt = require('bcrypt');

module.exports = {
  async create(req, res) {
    try {
      const { nome, email, uf, level, password } = req.body;

      if (!password) {
        return res.status(400).send({ erro: 'Senha não fornecida' });
      }

      const existingUser = await knex('clientes').where({ email }).first();
      if (existingUser) {
        return res.status(400).send({ erro: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await knex('clientes').insert({ nome, email, uf, level, senha: hashedPassword });

      return res.status(201).send({ nome, email, uf, level });

    } catch (error) {
      return res.status(400).json({ erro: 'Erro ao cadastrar', detalhes: error.message });
    }
  },

  async searchUsers(req, res) {
    try {
      const { email, password } = req.body;

      const user = await knex('clientes').where({ email }).first();

      if (!user) {
        return res.status(400).send({ erro: 'Usuário não encontrado' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.senha);

      if (!isPasswordValid) {
        return res.status(401).send({ erro: 'Senha incorreta' });
      }

      return res.status(200).send({ mensagem: 'Login bem-sucedido', user: { nome: user.nome, email: user.email } });

    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao autenticar', detalhes: error.message });
    }
  },

  async searchUsersAll(req, res) {
    try {
      const users = await knex('clientes').select('*');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar usuários', detalhes: error.message });
    }
  }
};