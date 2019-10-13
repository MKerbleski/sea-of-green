const knex = require('knex');

const dbEngine = process.env.DB || 'development';

const dbConfig = require('../../knexfile')[dbEngine];

const db = knex(dbConfig);

module.exports = {
    addUser,
    updateUser
}

function addUser(user){
    return db('users')
        .insert(user)
        .returning(user)
}

function updateUser(user){
    return db('users')
        .where('email', '=', user.email)
        .update(update)
}