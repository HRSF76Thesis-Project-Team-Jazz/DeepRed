const env = process.env.NODE_ENV || 'local';
let local;
if (env === 'local' || env === 'test') local = require('./config.dev.js');

const config = {
  knex: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || {
      database: 'deepred',
      user: 'postgres',
      password: 'postgres',
      host: 'localhost',
      port: 5432,
    },
    pool: {
      min: 1,
      max: 2,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'db/migrations',
    },
    seeds: {
      directory: 'db/seeds',
    },
  },

  passport: {
    Google: {
      clientID: process.env.GOOGLE_CLIENT_ID || local.Google.clientID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || local.Google.clientSecret,
      callbackURL: 'http://hrsf76deepred-staging.herokuapp.com/auth/google/callback',
    },

    Facebook: {
      clientID: process.env.FACEBOOK_CLIENT_ID || local.Facebook.clientID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || local.Facebook.clientSecret,
      callbackURL: 'http://hrsf76deepred-staging.herokuapp.com/auth/facebook/callback',
    },

    Twitter: {
      consumerKey: process.env.TWITTER_CONSUMER_KEY || local.Twitter.consumerKey,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET || local.Twitter.consumerSecret,
      callbackURL: 'http://hrsf76deepred-staging.herokuapp.com/auth/twitter/callback',
    },
  },
};

if (env === 'test') {
  config.knex.connection.database = 'deepred_test';
}

module.exports = config;
