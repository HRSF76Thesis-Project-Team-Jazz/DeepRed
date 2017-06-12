const axios = require('axios');
const watson = require('watson-developer-cloud');

const conversation = watson.conversation({
  username: '{username}',
  password: '{password}',
  version: 'v1',
  version_date: '2017-05-26',
});
