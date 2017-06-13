
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('DeepRed_WhiteMoves', function (table) {
      table.string('parent').nullable();
      table.string('board').nullable();
      table.integer('white_win').nullable();
      table.integer('black_win').nullable();
      table.integer('draw').nullable();
      table.decimal('winPercentage').nullable();
    }),
    knex.schema.createTableIfNotExists('DeepRed_BlackMoves', function (table) {
      table.string('parent').nullable();
      table.string('board').nullable();
      table.integer('white_win').nullable();
      table.integer('black_win').nullable();
      table.integer('draw').nullable();
      table.decimal('winPercentage').nullable();
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('auths'),
    knex.schema.dropTable('profiles'),
    // knex.schema.dropTable('DeepRed_WhiteMoves'),
    // knex.schema.dropTable('DeepRed_BlackMoves'),
  ]);
};

