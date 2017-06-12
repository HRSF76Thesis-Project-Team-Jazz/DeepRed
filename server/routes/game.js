const express = require('express');
const ChessGame = require('../chess/ChessGame');
const ConversationV1 = require('watson-developer-cloud/conversation/v1');

const conversation = new ConversationV1({
  url: 'https://gateway.watsonplatform.net/conversation/api',
  username: '757817a0-acdd-4cbc-a17e-9307b923048c',
  password: 'uZVqsH2Zi6x6',
  path: { workspace_id: '4440e6fc-92da-4518-afb9-9f47aae615cc' },
  version: 'v1',
  version_date: '2017-05-26',
});

const router = express.Router();

const processResponse = (err, response) => {
  if (err) {
    console.error(err);
    return;
  }
  if (response.output.text.length !== 0) {
    console.log(response.output.text[0]);
  }
};

const context = {
  input: {
    text: 'you win',
  },
};

router.route('/')
  .get((req, res) => {
    const newGame = new ChessGame();
    res.status(200).send(JSON.stringify(newGame));
  })
  .post((req, res) => {
    console.log('in the correct route');
    res.status(201).send({ data: 'Posted!' });
  });

router.route('/updateUserGameStat')
  .post((req, res) => {
    console.log(req.body);
    // query function goes here to update user game win lose stats
    res.send();
  });

router.route('/conversation')
  .post((req, res) => {
    console.log('123', req.body);
    conversation.message(context, processResponse);
    res.send();
  });

module.exports = router;
