const Appointment = require("../../models/Appointment");
const Front_Desk_Officer = require("../../models/Front_Desk_Officer");
const Patients = require("../../models/Patients");
const check_auth = require("../../utils/authorization");
const { ApolloError, UserInputError } = require("apollo-server");
module.exports = {
  Query: {
    async get_appointments(_, __, context) {
      const user = check_auth(context);
      try {
        const fdo = await Front_Desk_Officer.find({ _id: user.id });
        const patient = await Patients.find({ _id: user.id });
        if (!fdo || !patient) {
          throw new UserInputError("You are not authorized for this operation");
        }
        const appointment = await Appointment.find();
        if (!appointment) {
          throw new ApolloError("Appointments not available");
        }
        return appointment;
      } catch (err) {
        throw new Error(err);
      }
    },
    async get_appointments_by_id(_, { id }, context) {
      check_auth(context);

      try {
        if (id.trim() === "") {
          throw new UserInputError("provide a valid id");
        }

        const appointment = await Appointment.find({ _id: id });
        if (!appointment) {
          throw new ApolloError("Appointments not available");
        }
        console.log(appointment);
        return appointment;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async update_appointment(
      _,
      { appointment_id, body, time, doctor },
      context
    ) {
      const user = check_auth(context);

      try {
        if (!user) {
          throw new ApolloError("You are not authorized");
        }
        // validating appointment details
        if (appointment_id.trim() === "") {
          throw new UserInputError("ID field must be provided");
        }
        // if (appointment_id.trim().length < 24) {
        //   throw new UserInputError(
        //     "invalid ID, must not be less than 24 characters"
        //   );
        // }
        if (body.trim() === "") {
          throw new UserInputError("Appointment body cannot be empty ");
        }
        if (time.trim() === "") {
          throw new UserInputError(" time not provided, try again");
        }
        if (doctor.trim() === "") {
          throw new UserInputError(" doctor not provided, try again");
        }
        const appointment = await Appointment.findOne({ _id: appointment_id });

        if (!appointment) {
          throw new UserInputError("Appointment not found, try again!");
        }
        await Appointment.findByIdAndUpdate(appointment_id, {
          body,
          time,
          doctor,
        });
        const updated_appointment = await Appointment.findOne({
          _id: appointment_id,
        });
        return updated_appointment;
      } catch (err) {
        throw new Error(err);
      }
    },
    async delete_appointment(_, { appointment_id }, context) {
      const user = check_auth(context);
      try {
        if (!user) {
          throw new ApolloError("You are not authorized for this operation");
        }
        if (appointment_id.trim() === "") {
          throw new UserInputError("ID field must be provided");
        }
        await Appointment.findOneAndDelete({ _id: appointment_id });
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
