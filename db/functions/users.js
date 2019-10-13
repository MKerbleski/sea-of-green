const knex = require('knex');

const dbEngine = process.env.DB || 'development';

const dbConfig = require('../../knexfile')[dbEngine];

const db = knex(dbConfig);

module.exports = {
    addUser,
    updateUser,
    getUsers,
    getUser,
}

function addUser(user){
    return db('users')
        .insert(user)
}

function getUsers(){
    return new Promise((res, rej) => {
        res(db('users')
            .where('frequency', '>', 0))
    })
}

function getUser(id){
    return new Promise((res, rej) => {
        res(db('users')
            .where('id', '=', id))
    })
}

function updateUser(user){
    return db('users')
        .where('email', '=', user.email)
        .update(update)
}