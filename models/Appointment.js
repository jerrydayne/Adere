const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointment_schema = new Schema({
  time: { String },
  date: {
    type: Date,
    default: Date.now(),
  },
  by: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },
});

module.exports = mongoose.model("Appointment", appointment_schema);
