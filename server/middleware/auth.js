const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const config = require('../../config').redis;

const redisConfig = (config.url) ? { url: config.url } : {
  client: require('redis').createClient(),
  host: config.local.host,
  port: config.local.port,
};

module.exports.verify = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

module.exports.session = session({
  store: new RedisStore(redisConfig),
  secret: 'more laughter, more love, more life',
  resave: config.url === undefined,
  saveUninitialized: config.url === undefined,
});
