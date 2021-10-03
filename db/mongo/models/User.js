import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  emotion: String,
  normalEmotion: String,
  emoEmotion: String,
  animal: String,
  petName: String,
  birthday: String,
  fruit: String,
  sugar: String,
  mainResult: String,
  emoResult: String,
});

const User = mongoose.model('User', userSchema);

export default User;
