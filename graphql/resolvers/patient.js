const Patients = require("../../models/Patients");
const check_auth = require("../../utils/authorization");
const Appointment = require("../../models/Appointment");
const {
  validateUserInput,
  validateLoginInput,
} = require("../../utils/validator");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { MY_SECRET } = require("../../configs/jwt");
const jwt = require("jsonwebtoken");
function generateToken(patient) {
  return jwt.sign(
    {
      id: patient.id,
    },
    MY_SECRET,
    { expiresIn: "1h" }
  );
}
module.exports = {
  Query: {},
  Mutation: {
    async register_patient(
      _,
      {
        register_Patient: {
          first_name,
          last_name,
          other_name,
          email,
          phone_number,
          address,
          occupation,
          relationship,
          age,
          sex,
          dob,
          educational_status,
          marital_status,
          next_of_kin,
          next_of_kin_phone_number,
          clinic_name,
          clinic_number,
          location,
          patient_id,
          date_enrolled,
          care_entry_point,
          date_of_confirmed_HIV_test,
          mode_of_HIV_test,
          where,
          prior_ART,
          date_transferred_in,
          facility_transferred_from,
          otp,
        },
      },
      context,
      info
    ) {
      try {
        check_auth(context);
        const { errors, valid } = validateUserInput(
          first_name,
          last_name,
          other_name,
          email,
          phone_number,
          address,
          occupation,
          relationship,
          age,
          sex,
          dob,
          educational_status,
          marital_status,
          next_of_kin,
          next_of_kin_phone_number,
          clinic_name,
          clinic_number,
          location,
          patient_id,
          date_enrolled,
          care_entry_point,
          date_of_confirmed_HIV_test,
          mode_of_HIV_test,
          where,
          prior_ART,
          date_transferred_in,
          facility_transferred_from,
          otp
        );

        if (!valid) {
          throw new UserInputError("Error", { errors });
        }
        const checked_patient = await Patients.findOne({ email });
        if (checked_patient) {
          throw new UserInputError(
            "email is already in use by another client",
            {
              errors: {
                email: "email is already in use by another client",
              },
            }
          );
        } else {
          const newPatient = new Patients({
            first_name,
            last_name,
            other_name,
            email,
            phone_number,
            address,
            occupation,
            relationship,
            age,
            sex,
            dob,
            educational_status,
            marital_status,
            next_of_kin,
            next_of_kin_phone_number,
            clinic_name,
            clinic_number,
            location,
            patient_id,
            date_enrolled,
            care_entry_point,
            date_of_confirmed_HIV_test,
            mode_of_HIV_test,
            where,
            prior_ART,
            date_transferred_in,
            facility_transferred_from,
            otp,
          });

          const patient = await newPatient.save();
          return patient;
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async patient_login(_, { clinic_name, otp, patient_id }, context) {
      // TODO validate input
      const { valid, errors } = validateLoginInput(
        clinic_name,
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
        if (patient.clinic_name !== clinic_name) {
          throw new UserInputError("Clinic not found'");
        }
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
    async create_patient_Appointment(
      _,
      { patient_id, body, time, doctor },
      context
    ) {
      const user = check_auth(context);
      try {
        if (patient_id.trim() === "") {
          throw new UserInputError(
            " you are not authorized, provide a valid id"
          );
        }
        if (body.trim() === "") {
          throw new UserInputError("Appointment body cannot be empty ");
        }
        if (time.trim() === "") {
          throw new UserInputError(" time not provided, try again");
        }

        const patient = await Patients.findOne({ _id: patient_id });
        if (!patient) {
          throw new UserInputError(
            "You are not authorized to create appointment"
          );
        }
        const new_appointment = new Appointment({
          body,
          time,
          doctor,
          //   by: user.id,
        });
        new_appointment.by[1] = user.id;
        const appointment = await new_appointment.save();
        patient.appointments.unshift(appointment._id);
        const patient_res = await patient.save();

        return {
          message: "Appointment created successfully!",
          id: appointment._id,
          ...appointment._doc,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
