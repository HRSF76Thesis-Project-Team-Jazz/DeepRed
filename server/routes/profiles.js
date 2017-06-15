'use strict';

const express = require('express');

const router = express.Router();
const ProfileController = require('../controllers').Profiles;
const middleware = require('../middleware');

router.route('/')
  .get(ProfileController.getAll)
  // .post(ProfileController.create)
  ;

router.route('/id')
  .get(ProfileController.getOne)
  .put(ProfileController.update)
  // .delete(ProfileController.deleteOne)
  ;

router.route('/:id')
  .get(ProfileController.getOne)
  .put(ProfileController.update)
  // .delete(ProfileController.deleteOne)
  ;

router.route('/*')
  .get(middleware.auth.verify, (req, res) => {
    res.render('index.ejs');
  });

module.exports = router;
