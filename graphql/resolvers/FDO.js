const Doctor = require("../../models/Doctor");
const Front_Desk_Officer = require("../../models/Front_Desk_Officer");
const jwt = require("jsonwebtoken");
const { MY_SECRET } = require("../../configs/jwt");
const check_auth = require("../../utils/authorization");
const { UserInputError } = require("apollo-server");
const Appointment = require("../../models/Appointment");

/**
 * TODO
 *  Register patient
 *  Book appointment
 *  search all patient records
 * assign doctor/reschedulin
 * */

module.exports = {
  Query: {
    async get_FDO(_, __, context) {
      check_auth(context);
      try {
        const fdo = await Front_Desk_Officer.find();
        if (!fdo) {
          throw new UserInputError("Front Desk Officer not found!", {
            errors: "Front Desk Officer not found",
          });
        }
        return fdo;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPatients(_, __, context) {
      check_auth(context);
      try {
        const patients = await Patients.find();
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
    async create_fdo_Appointment(_, { fdo_id, body, time, doctor }, context) {
      const user = check_auth(context);
      try {
        // validating appointment details
        if (fdo_id.trim() === "") {
          throw new UserInputError("ID field must be provided");
        }
        if (fdo_id.trim().length < 24) {
          throw new UserInputError(
            "invalid ID, must not be less than 24 characters"
          );
        }
        if (body.trim() === "") {
          throw new UserInputError("Appointment body cannot be empty ");
        }
        if (time.trim() === "") {
          throw new UserInputError(" time not provided, try again");
        }
        if (doctor.trim() === "") {
          throw new UserInputError(" doctor not provided, try again");
        }
        const fdo = await Front_Desk_Officer.findOne({ _id: fdo_id });

        if (!fdo) {
          throw new UserInputError(
            "You are not authorized to create appointment"
          );
        }

        const new_appointment = new Appointment({
          body,
          time,
          doctor,
        });
        new_appointment.by[0] = user.id;
        const appointment = await new_appointment.save();

        fdo.appointments.push(appointment._id);
        await fdo.save();

        return {
          id: appointment._id,
          ...appointment._doc,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
