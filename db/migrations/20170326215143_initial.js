exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTableIfNotExists('profiles', (table) => {
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
    knex.schema.createTableIfNotExists('auths', (table) => {
      table.increments('id').unsigned().primary();
      table.string('type', 8).notNullable();
      table.string('oauth_id', 30).nullable();
      table.string('password', 100).nullable();
      table.string('salt', 100).nullable();
      table.integer('profile_id').references('profiles.id').onDelete('CASCADE');
    }),
    knex.schema.createTableIfNotExists('DeepRed_WhiteMoves', (table) => {
      table.string('parent').nullable();
      table.string('board').nullable();
      table.integer('white_win').nullable();
      table.integer('black_win').nullable();
      table.integer('draw').nullable();
      table.decimal('winPercentage').nullable();
    }),
    knex.schema.createTableIfNotExists('DeepRed_BlackMoves', (table) => {
      table.string('parent').nullable();
      table.string('board').nullable();
      table.integer('white_win').nullable();
      table.integer('black_win').nullable();
      table.integer('draw').nullable();
      table.decimal('winPercentage').nullable();
    }),
    knex.schema.createTableIfNotExists('AIstats', (table) => {
      table.string('email', 100).nullable().unique();
      table.string('display', 100).nullable();
      table.string('AIcolor').nullable();
      table.integer('gameCountInAImode');
      table.integer('lossInAImode');
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('auths'),
    knex.schema.dropTable('profiles'),
    knex.schema.dropTable('DeepRed_WhiteMoves'),
    knex.schema.dropTable('DeepRed_BlackMoves'),
  ]);
};
