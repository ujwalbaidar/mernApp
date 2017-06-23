const mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: { type: String, unique: true },
  password: { type: String, required: true },
  country: String,
  state: String,
  city: String,
  street: String,
  dob: Object,
  gender: String,
  status: { type: Boolean, default: false },
  createdDate: {
    type: Date,
    default: new Date()
  },
  updatedDate: {
    type: Date,
    default: new Date()
  }
});
mongoose.model('User', userSchema);