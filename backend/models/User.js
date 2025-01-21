const express = require('express');
const mongoose = require('mongoose');



const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  contact: { type: String, required: true}
});

const User = mongoose.model('User', UserSchema,'User');
module.exports = User;