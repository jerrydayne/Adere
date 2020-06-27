const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const doctor_schema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  username: { type: String },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String },
  user_type: { type: String },
  user_role: { type: String },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Doctor", doctor_schema);
