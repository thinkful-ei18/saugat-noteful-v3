
'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/user');

router.post('/users', (req, res, next) => {
  const { fullname, username, password } = req.body;

  const newUser = { fullname, username, password };

  if (!username || !password) {
    const err = new Error('Username and password fields cannot be blank ');
    err.status = 400;
    return next(err);
  }

  User.create(newUser)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      return next(err);
    });
});


module.exports = router;