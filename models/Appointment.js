const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointment_schema = new Schema({
  time: { type: String },
  date: {
    type: Date,
    default: Date.now(),
  },
  body: { type: String },
  by: [
    { type: Schema.Types.ObjectId, ref: "Front_Desk_Officer" },
    { type: Schema.Types.ObjectId, ref: "Patients" },
  ],
  doctor: {
    type: String,
  },
});

module.exports = mongoose.model("Appointment", appointment_schema);
