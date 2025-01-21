const express = require('express');
const mongoose = require('mongoose');
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
const User = require('./User')


const ReportSchema = new mongoose.Schema({

  username:{type:String},
  complaint: { type: String, required: true },
  department: { type: String, required: true,set: capitalize },
  location: { type: String, required: true,set: capitalize },
  status: { type: String, default: 'Noted' },
  createdAt: { type: Date, default: Date.now },
  EscalatedAt:{type:Date,default:null},
  completedAt:{type: Date,default:null},
  remarks:{type:String,default:null},
  contact: { type:String, ref: User, required: true },
  verified: { type: Boolean, default: false }, // New field for verification
  verifiedAt: { type: Date, default: null },   // Timestamp for verification 
});

const Report = mongoose.model('Report', ReportSchema,'Report');
module.exports = Report;