const env = process.env.NODE_ENV || 'local';
let local;
if (env === 'local' || env === 'test') local = require('./config.dev.js');

const callbackURL = (name) => {
  if (env === 'local' || env === 'test') return `http://localhost:3000/auth/${name}/callback`;
  const suffix = (process.env.NODE_ENV === 'staging') ? '-staging' : '';
  return `http://hrsf76deepred${suffix}.herokuapp.com/auth/${name}/callback`;
};

// NODE_ENV=test

const config = {
  knex: {
    client: 'postgresql',
    connection: {
      database: process.env.DB || 'deepred',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      url: process.env.DATABASE_URL || '',
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

  redis: {
    url: process.env.REDIS_URL,
    local: {
      host: 'localhost',
      port: 6379,
    },
  },

  passport: {
    Google: {
      clientID: process.env.GOOGLE_CLIENT_ID || local.Google.clientID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || local.Google.clientSecret,
      callbackURL: callbackURL('google'),
    },

    Facebook: {
      clientID: process.env.FACEBOOK_CLIENT_ID || local.Facebook.clientID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || local.Facebook.clientSecret,
      callbackURL: callbackURL('facebook'),
    },

    Twitter: {
      consumerKey: process.env.TWITTER_CONSUMER_KEY || local.Twitter.consumerKey,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET || local.Twitter.consumerSecret,
      callbackURL: callbackURL('twitter'),
    },
  },
};

if (env === 'test') {
  config.knex.connection.database = 'deepred_test';
}
if (env === 'travis_ci') {
  config.knex.connection.database = 'deepred_travis';
}

module.exports = config;
