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
    return err;
  }
  if (response.output.text.length !== 0) {
    if (!response.output) {
      response.output = {};
    }
    // console.log('response: ', response);
    return response;
  }
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
    console.log('triggered event and message: ', req.body);

    const payload = {
      workspace_id: '4440e6fc-92da-4518-afb9-9f47aae615cc',
      context: req.body.intent || {},
      input: req.body.input || {},
    };

    conversation.message(payload, (err, data) => {
      if (err) {
        console.error('err occurred in watson conversation message function: ', err);
      }
      res.send(processResponse(err, data));
    });
  });

module.exports = router;
