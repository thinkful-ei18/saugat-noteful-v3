
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

  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        fullname
      };
      return User.create(newUser)
    })
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;