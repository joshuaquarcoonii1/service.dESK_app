const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  department: { type: String, default: null },
  location: { type: String, default: null },
  avaya: { type: Number, required: true }
});

const NameSearch = mongoose.model("NameSearch", userSchema, "NameSearch");
module.exports = NameSearch;