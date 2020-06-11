const Patients = require("../../models/Patients");
const {
  validateUserInput,
  validateLoginInput,
} = require("../../utils/validator");
const { UserInputError } = require("apollo-server");
const { MY_SECRET } = require("../../configs/jwt");
const jwt = require("jsonwebtoken");
function generateToken(patient) {
  return jwt.sign(
    {
      id: patient.id,
      phone_number: patient.phone_number,
      otp: patient.otp,
    },
    MY_SECRET,
    { expiresIn: "1h" }
  );
}
module.exports = {
  Query: {
    async getPatients() {
      try {
        const patients = await Patients.find();
        console.log(patients);
        if (!patients) {
          throw new Error("user not found");
        }
        return patients;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async register(
      _,
      {
        registerInput: {
          first_name,
          last_name,
          other_name,
          email,
          phone_number,
          sex,
          dob,
          educational_status,
          marital_status,
          next_of_kin,
          next_of_kin_phone_number,
          clinic_name,
          clinic_number,
          patient_id,
          location,
          date_enrolled,
          otp,
        },
      },
      context,
      info
    ) {
      const { errors, valid } = validateUserInput(
        first_name,
        last_name,
        other_name,
        email,
        phone_number,
        sex,
        dob,
        educational_status,
        marital_status,
        next_of_kin,
        next_of_kin_phone_number,
        clinic_name,
        clinic_number,
        patient_id,
        location,
        date_enrolled,
        otp
      );

      if (!valid) {
        throw new UserInputError("Error", { errors });
      }
      const checked_patient = await Patients.findOne({ email });
      if (checked_patient) {
        throw new UserInputError("email is already in use by another client", {
          errors: {
            email: "email is already in use by another client",
          },
        });
      } else {
        const newPatient = new Patients({
          first_name,
          last_name,
          other_name,
          email,
          phone_number,
          sex,
          dob,
          educational_status,
          marital_status,
          next_of_kin,
          next_of_kin_phone_number,
          clinic_name,
          clinic_number,
          patient_id,
          location,
          date_enrolled,
          otp,
        });
        const patient = await newPatient.save();
        return patient;
      }
    },

    async login(_, { phone_number, otp, patient_id }, context) {
      // TODO validate input
      const { valid, errors } = validateLoginInput(
        phone_number,
        otp,
        patient_id
      );
      if (!valid) {
        throw new UserInputError("Error", { errors });
      }
      // check if user is already saved
      try {
        const patient = await Patients.findOne({ patient_id });
        if (!patient) {
          // errors.general = "patient not found";
          throw new UserInputError("patient not found");
        }
        if (patient.otp !== otp) {
          throw new UserInputError("otp do not match");
        }
        if (patient.phone_number !== phone_number) {
          throw new UserInputError("Phone number do not match any users'");
        }
        // generate token
        const token = generateToken(patient);

        return {
          ...patient._doc,
          id: patient._id,
          token,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
