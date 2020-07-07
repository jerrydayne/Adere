const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointment_schema = new Schema({
  time: { type: String },
  date: {
    type: Date,
    default: Date.now(),
  },
  body: { type: String },
  doctor: {
    type: String,
  },
  creator: { type: Schema.Types.ObjectId, ref: "Admin" },
});

module.exports = mongoose.model("Appointment", appointment_schema);
