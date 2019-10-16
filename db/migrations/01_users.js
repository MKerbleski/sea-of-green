
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(tbl){
        tbl.increments()
        tbl.string('first')
        tbl.string('last')
        tbl.integer('frequency')
        tbl.string('email')
        tbl.timestamp('created_at').defaultTo(knex.fn.now())
        tbl.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users')
  };
  