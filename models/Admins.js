const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const admin_schema = new Schema({
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
  created_appointment: [
    {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  user_type: { type: String },
  user_role: { type: String },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Admin", admin_schema);
