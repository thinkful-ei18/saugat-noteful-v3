'use strict';

const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { type: String, unique: true}
});

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;