const Appointment = require("../../models/Appointment");
const Admin = require("../../models/Admins");
const Patients = require("../../models/Patients");
const Booking = require("../../models/Booking");
const check_auth = require("../../utils/authorization");
const {
  ApolloError,
  UserInputError,
  AuthenticationError,
} = require("apollo-server");
const Admins = require("../../models/Admins");
// const get_user = async (user_id) => {
//   const user = await Admins.findById(user_id);
//   return user;
// };
const appointments = async (appointmentId) => {
  const appointments = await Appointment.find({
    _id: { $in: appointmentId },
  });
  const appt = appointments.map((appointment) => {
    return {
      ...appointment._doc,
      _id: appointment.id,
      date: new Date(appointment._doc.date).toISOString(),
      creator: admin_transform.bind(this, appointment.creator),
    };
  });
  return appt;
};
const single_appointment = async (appointmentId) => {
  const appointment = await Appointment.findOne({
    _id: appointmentId,
  });

  return {
    ...appointment._doc,
    _id: appointment.id,
    date: new Date(appointment._doc.date).toISOString(),
    creator: admin_transform.bind(this, appointment.creator),
  };
};
const admin_transform = async (userID) => {
  const users = await Admin.findById(userID);
  return {
    ...users._doc,
    _id: users.id,
    created_appointment: appointments.bind(
      this,
      users._doc.created_appointment
    ),
  };
};
const patient_transform = async (userID) => {
  const users = await Patients.findById(userID);
  return {
    ...users._doc,
    _id: users.id,
    created_appointment: appointments.bind(
      this,
      users._doc.created_appointment
    ),
  };
};
module.exports = {
  Query: {
    async get_appointments(_, __, context) {
      const appointments = await Appointment.find();
      let appt = appointments.map((appointment) => {
        return {
          ...appointment._doc,
          _id: appointment.id,
          date: new Date(appointment._doc.date).toISOString(),
          creator: admin_transform.bind(this, appointment._doc.creator),
        };
      });

      return appt;
    },
    async get_appointments_by_id(_, { id }, context) {},
    async get_booking() {
      try {
        const bookings = await Booking.find();
        const result = bookings.map((booking) => {
          console.log(booking);
          return {
            ...booking._doc,
            _id: booking.id,
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString(),
            appointment: single_appointment.bind(
              this,
              booking._doc.appointment
            ),
            patient: patient_transform.bind(this, booking._doc.patient),
          };
        });
        return result;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    async create_appointment(_, { user_id, body, doctor, time }, context) {
      const user = check_auth(context); // validating appointment details
      if (user_id.trim() === "") {
        throw new UserInputError("ID field must be provided");
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
      if (user.id !== user_id) {
        throw new AuthenticationError(
          "You are not authorized for this operation, ID matter"
        );
      }
      if (user.user_role !== "front_desk_officer") {
        throw new AuthenticationError(
          "You are not authorized to create appointment, role matter"
        );
      }
      try {
        const admin = await Admins.findById({ _id: user.id });
        const new_appointment = new Appointment({
          body,
          time,
          doctor,
        });

        new_appointment.creator = user.id;
        let created_appt;
        const res = await new_appointment.save();
        admin.created_appointment.push(new_appointment);
        created_appt = {
          ...res._doc,
          _id: res.id.toString(),
          creator: admin_transform.bind(this, res._doc.creator),
        };
        await admin.save();
        return created_appt;
      } catch (err) {
        throw new Error(err);
      }
    },
    // async update_appointment(
    //   _,
    //   { appointment_id, body, time, doctor },
    //   context
    // ) {
    //   const user = check_auth(context);

    //   try {
    //     if (!user) {
    //       throw new ApolloError("You are not authorized");
    //     }
    //     // validating appointment details
    //     if (appointment_id.trim() === "") {
    //       throw new UserInputError("ID field must be provided");
    //     }

    //     if (body.trim() === "") {
    //       throw new UserInputError("Appointment body cannot be empty ");
    //     }
    //     if (time.trim() === "") {
    //       throw new UserInputError(" time not provided, try again");
    //     }
    //     if (doctor.trim() === "") {
    //       throw new UserInputError(" doctor not provided, try again");
    //     }
    //     const appointment = await Appointment.findOne({ _id: appointment_id });

    //     if (!appointment) {
    //       throw new UserInputError("Appointment not found, try again!");
    //     }
    //     await Appointment.findByIdAndUpdate(appointment_id, {
    //       body,
    //       time,
    //       doctor,
    //     });
    //     const updated_appointment = await Appointment.findOne({
    //       _id: appointment_id,
    //     });
    //     return updated_appointment;
    //   } catch (err) {
    //     throw new Error(err);
    //   }
    // },
    // async delete_appointment(_, { appointment_id }, context) {
    //   const user = check_auth(context);
    //   try {
    //     if (!user) {
    //       throw new ApolloError("You are not authorized for this operation");
    //     }
    //     if (appointment_id.trim() === "") {
    //       throw new UserInputError("ID field must be provided");
    //     }
    //     await Appointment.findOneAndDelete({ _id: appointment_id });
    //   } catch (err) {
    //     throw new Error(err);
    //   }
    // },
    async book_appointment(_, { appointment_id }, context) {
      const user = check_auth(context);

      if (!user) {
        throw new AuthenticationError("you are not authorized");
      }
      const patient = await Patients.findById({ _id: user.id });
      if (!patient) {
        throw new ApolloError("Patient not found");
      }
      const existed_appointment = await Appointment.findById(appointment_id);
      if (!existed_appointment) {
        throw new ApolloError("Appointment not found");
      }
      try {
        const new_booking = new Booking({
          appointment: existed_appointment,
          patient: patient,
        });
        const booking = await new_booking.save();

        return {
          ...booking._doc,
          _id: booking.id,
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      } catch (err) {
        throw err;
      }
    },
  },
};
