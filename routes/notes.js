'use strict';

const express = require('express');
// Create an router instance (aka "mini-app")
const mongoose = require('mongoose');

const router = express.Router();
const Note = require('../models/note');
const { MONGODB_URI } = require('../config');

router.get('/notes', (req, res, next) => {
  console.log('Hello!');
  const { searchTerm } = req.query;

  if (searchTerm) {
    Note.find(
      { $text: { $search: searchTerm } })
      .populate('tags')
      .then(response => {
        return res.json(response);
      })
      .catch(err => {
        return next(err);
      });

  }
  else {
    Note.find()
      .populate('tags')
      .then(response => {
        res.json(response);
      })
      .catch(err => {
        next(err);
      });
  }
});


router.get('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  Note.findById(id)
    .populate('tags')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});



router.post('/notes', (req, res, next) => {

  if (!req.body.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const { title, content, tags } = req.body;
  const updateObj = {
    title,
    content,
    tags
  };

  return Note.create(updateObj)
    .then(result => {
      return res.status(201).json(result);
    })
    .catch(err => {
      res.status(422).send(err);
    });
});



router.put('/notes/:id', (req, res, next) => {

  const id = req.params.id;

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

  Note.findByIdAndUpdate(id, updateObj)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});



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