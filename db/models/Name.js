const mongoose = require('mongoose');

const nameSchema = new mongoose.Schema({
  emotion: String,
  normalEmotion: String,
  emoEmotion: String,
  animal: String,
  petName: String,
  birthday: String,
  fruit: String,
  sugar: String,
  result: String,
  mainResult: String,
  emoResult: String,
});

const Name = mongoose.model('Name', nameSchema);

module.exports = Name;
