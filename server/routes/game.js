const express = require('express');
const ChessGame = require('../chess/ChessGame');

const router = express.Router();

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

module.exports = router;
