const mongoose = require('mongoose')
const { Schema } = mongoose;
const UserSchema = new Schema({
  username: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },

  password: {
    type: String,
    require: true
  },
  cover: String,
});
const User = mongoose.model('User', UserSchema);
//   User.createIndexes();
module.exports = User;