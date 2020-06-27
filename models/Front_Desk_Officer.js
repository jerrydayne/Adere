const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const front_desk_officer_schema = new Schema({
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
  appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
});

module.exports = mongoose.model(
  "Front_Desk_Officer",
  front_desk_officer_schema
);
