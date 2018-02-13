'use strict'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

mongoose.connect(MONGODB_URI)
  .then(() => {
    const searchTerm = 'lady gaga';
    let filter = {};

    if (searchTerm) {
      const re = new RegExp(searchTerm, 'i');
      filter.title = { $regex: re };
    }

    return Note.find(filter)
      .select('title created')
      .sort('created')
      .then(results => {
        console.log(results);
      })
      .catch(console.error);
  })

  .then(() => {
    const id = '000000000000000000000004';
    return Note.findById(id)
      .then(results => {
        console.log(results);
      })
      .catch(console.error);
  })

  .then(() => {
    const updateObj = {
      title: "Testing currently",
      content: "'Lorem ipsum dolor sit amet, boring consectetur adipiscing elit"
    };
    return Note.create(updateObj)
      .then(results => {
        console.log(results);
      })
      .catch(console.error);
  })

  .then(() => {
    return Note.update()
      .then(results => {
        console.log(results);
      })
      .catch(console.error);
  })
  .then(() => {
    return mongoose.disconnect()
      .then(() => {
        console.info('Disconnected');
      });
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });