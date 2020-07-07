const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const booking_schema = new Schema(
  {
    appointment: { type: Schema.Types.ObjectId, ref: "Appointment" },
    patient: { type: Schema.Types.ObjectId, ref: "Patient" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", booking_schema);
