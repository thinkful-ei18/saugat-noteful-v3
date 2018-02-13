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

  console.log('Get All Notes');

  mongoose.connect(MONGODB_URI)
    .then(() => {
      const searchTerm = req.query.searchTerm;
      let filter = {};

      if (searchTerm) {
        const re = new RegExp(searchTerm, 'i');
        filter.title = { $regex: re };

      }

      return Note.find(filter)
        .select('title created')
        .sort('created')
        .then(results => {
          res.json(results);
        })
        .catch(err => {
          next(err);
        });
    });

});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/notes/:id', (req, res, next) => {

  console.log('Get a Note');
  mongoose.connect(MONGODB_URI)
    .then(() => {
      const id = req.params.id;
      return Note.findById(id)
        .then(results => {
          res.json(results);
        })
        .catch(err => {
          next(err);
        });
    });

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/notes', (req, res, next) => {

  const { title, content } = req.body;
  const updateObj = {
    title,
    content
  };
  mongoose.connect(MONGODB_URI)
    .then(() => {
      return Note.create(updateObj)
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          next(err);
        });
    });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {

  console.log('Update a Note');
  res.json({ id: 2 });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {

  console.log('Delete a Note');
  res.status(204).end();

});

module.exports = router;