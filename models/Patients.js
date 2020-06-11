const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const patientSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  other_name: { type: String },
  email: { type: String },
  phone_number: { type: String },
  sex: { type: String },
  dob: { type: String },
  educational_status: { type: String },
  marital_status: { type: String },
  next_of_kin: { type: String },
  next_of_kin_phone_number: { type: String },
  clinic_name: { type: String },
  clinic_number: { type: String },
  location: { type: String },
  patient_id: { type: String },
  date_enrolled: { type: String },
  otp: { type: String },
});

module.exports = mongoose.model("Patient", patientSchema);
