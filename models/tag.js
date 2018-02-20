'use strict';

const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, index: true, unique: true}
});

tagSchema.index({name: 'text'});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;