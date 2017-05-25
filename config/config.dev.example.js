/**
 * NOTE: for development, change name to config.dev.js and enter keys
 */

module.exports = {
  Google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://hrsf76deepred-staging.herokuapp.com/auth/google/callback',
  },

  Facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://hrsf76deepred-staging.herokuapp.com/auth/facebook/callback',
  },

  Twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://hrsf76deepred-staging.herokuapp.com/auth/twitter/callback',
  },
};
