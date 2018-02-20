'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {type: String},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true }
});

userSchema.set('toObject', {
  transform: (doc, ret, options) =>{
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  } 
});

const User = mongoose.model('User', userSchema);

module.exports = User;