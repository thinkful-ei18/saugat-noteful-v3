'use strict';

const express = require('express');
// Create an router instance (aka "mini-app")
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const router = express.Router();
const Note = require('../models/note');
const { MONGODB_URI } = require('../config');
/* ========== GET/READ ALL ITEM ========== */
router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  Note.find()
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      next(err);
    });
});


/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  
  if (!req.body.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  Note.findById(id)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});



/* ========== POST/CREATE AN ITEM ========== */
router.post('/notes', (req, res, next) => {

  if (!req.body.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const { title, content } = req.body;
  const updateObj = {
    title,
    content
  };

  Note.create(updateObj)
    .then(result => {
      res.status(201);
    })
    .catch(err => {
      next(err);
    });
});



/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  const { title, content } = req.body;
  const updateObj = {
    title,
    content
  };

  Note.findByIdAndUpdate(id, updateObj)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});



/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  Note.findByIdAndRemove(id)
    .then(results => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});



module.exports = router;