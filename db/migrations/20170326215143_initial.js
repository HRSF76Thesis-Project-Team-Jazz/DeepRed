
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('profiles', function (table) {
      table.increments('id').unsigned().primary();
      table.string('first', 100).nullable();
      table.string('last', 100).nullable();
      table.string('display', 100).nullable();
      table.string('email', 100).nullable().unique();
      table.string('phone', 100).nullable();
      table.integer('win').nullable();
      table.integer('loss').nullable();
      table.integer('draw').nullable();
      table.integer('total_games').nullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTableIfNotExists('auths', function(table) {
      table.increments('id').unsigned().primary();
      table.string('type', 8).notNullable();
      table.string('oauth_id', 30).nullable();
      table.string('password', 100).nullable();
      table.string('salt', 100).nullable();
      table.integer('profile_id').references('profiles.id').onDelete('CASCADE');
    }),
    knex.schema.createTableIfNotExists('games', function(table) {
      table.increments('game').unsigned().primary();
      table.string('session_id').nullable();
      table.string('white').nullable();
      table.string('black').nullable();
      table.string('result').nullable();
      table.integer('rounds').nullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTableIfNotExists('game_moves', function(table){
      table.increments('move').unsigned().primary();
      table.string('action').nullable();
      table.boolean('capture').nullable();
      table.integer('round').nullable();
      table.integer('game').nullable().references('games.game').onDelete('CASCADE');
      table.timestamps(true, true);
    }),
    knex.schema.createTableIfNotExists('game_pieces', function(table){
      table.increments('piece').unsigned().primary();
      table.string('piece_type').nullable();
      table.string('game').nullable();
      table.string('color').nullable();
      table.string('round').nullable();
      table.timestamps(true, true);
      table.integer('game').nullable().references('games.game').onDelete('CASCADE');
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('auths'),
    knex.schema.dropTable('profiles'),
    knex.schema.dropTable('games')
  ]);
};

