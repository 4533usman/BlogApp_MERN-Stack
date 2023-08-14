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
  }
});
const User = mongoose.model('User', UserSchema);
//   User.createIndexes();
module.exports = User;