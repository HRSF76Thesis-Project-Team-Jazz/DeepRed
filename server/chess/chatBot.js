const axios = require('axios');
const watson = require('watson-developer-cloud');

const conversation = watson.conversation({
  username: '757817a0-acdd-4cbc-a17e-9307b923048c',
  password: 'uZVqsH2Zi6x6',
  version: 'v1',
  version_date: '2017-05-26',
});

let context = {};

conversation.message({
  workspace_id: '4440e6fc-92da-4518-afb9-9f47aae615cc'
})