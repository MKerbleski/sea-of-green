const knex = require('knex');

const dbEngine = process.env.DB || 'development';

const dbConfig = require('../../knexfile')[dbEngine];

const db = knex(dbConfig);

module.exports = {
    addUser,
    updateUser,
    getUsers,
}

function addUser(user){
    return db('users')
        .insert(user)
        .returning(user)
}

function getUsers(){
    return new Promise((res, rej) => {
        res(db('users')
            .where('frequency', '>', 0))
    })
}

function updateUser(user){
    return db('users')
        .where('email', '=', user.email)
        .update(update)
}