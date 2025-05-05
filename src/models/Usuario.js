const knex = require('../database');

const Usuario = {
    async create({ email, senha }) {
        try {
            const result = await knex('clientes').insert({ email, senha });
            return result;
        } catch (error) {
            throw new Error('Erro ao cadastrar usuário: ' + error.message);
        }
    }
};

module.exports = Usuario;
