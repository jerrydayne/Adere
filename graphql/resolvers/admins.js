const Doctor = require("../../models/Doctor");
const Front_Desk_Officer = require("../../models/Front_Desk_Officer");
const jwt = require("jsonwebtoken");
const { MY_SECRET } = require("../../configs/jwt");
const {
  validateAdminInput,
  validateAdminLoginInput,
} = require("../../utils/validator");
const check_auth = require("../../utils/authorization");
const { UserInputError, ApolloError } = require("apollo-server");
const bcrypt = require("bcryptjs");
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      user_role: user.user_role,
    },
    MY_SECRET,
    { expiresIn: "1h" }
  );
}
module.exports = {
  Mutation: {
    async register_doctor(
      _,
      {
        Register_Doctor: {
          first_name,
          last_name,
          username,
          email,
          phone_number,
          password,
          confirm_password,
        },
      },
      context,
      info
    ) {
      check_auth(context);
      const { valid, errors } = validateAdminInput(
        first_name,
        last_name,
        username,
        email,
        phone_number,
        password,
        confirm_password
      );
      if (!valid) {
        throw new UserInputError("Error", {
          errors: { errors },
        });
      }

      try {
        if (password !== confirm_password) {
          throw new UserInputError("password do not match, try again");
        }
        const admin = await Doctor.findOne({ email });
        if (admin) {
          throw new ApolloError("email already used by an admin");
        }
        const hashed_password = await bcrypt.hash(password, 12);
        const new_front_desk_officer = new Doctor({
          first_name,
          last_name,
          username,
          email,
          phone_number,
          password: hashed_password,
        });
        new_front_desk_officer.user_type = "admin";
        new_front_desk_officer.user_role = "doctor";
        const doctor = await new_front_desk_officer.save();
        console.log(doctor);
        return {
          message: "Doctor registered successfully",
          ...doctor._doc,
          id: doctor._id,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    async register_front_desk_officer(
      _,
      {
        Register_Front_Desk_Officer: {
          first_name,
          last_name,
          username,
          email,
          phone_number,
          password,
          confirm_password,
        },
      },
      context,
      info
    ) {
      check_auth(context);
      const { valid, errors } = validateAdminInput(
        first_name,
        last_name,
        username,
        email,
        phone_number,
        password,
        confirm_password
      );
      if (!valid) {
        throw new UserInputError("Error", {
          errors: { errors },
        });
      }

      try {
        if (password !== confirm_password) {
          throw new UserInputError("password do not match, try again");
        }
        const admin = await Front_Desk_Officer.findOne({ email });
        if (admin) {
          throw new ApolloError("email already used by an admin");
        }
        const hashed_password = await bcrypt.hash(password, 12);
        const new_front_desk_officer = new Front_Desk_Officer({
          first_name,
          last_name,
          username,
          email,
          phone_number,
          password: hashed_password,
        });
        new_front_desk_officer.user_type = "admin";
        new_front_desk_officer.user_role = "front_desk_officer";
        const front_desk_officer = await new_front_desk_officer.save();

        return {
          message: "Front Desk Officer registered successfully",
          ...front_desk_officer._doc,
          id: front_desk_officer._id,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    async doctor_login(_, { email, password }) {
      const { valid, errors } = validateAdminLoginInput(email, password);
      if (!valid) {
        throw new UserInputError("Error", {
          errors: { errors },
        });
      }

      try {
        const matched_doctor = await Doctor.findOne({ email });

        if (!matched_doctor) {
          throw new ApolloError("Admin not found, try again!");
        }
        const ismatched = await bcrypt.compare(
          password,
          matched_doctor.password
        );
        if (!ismatched) {
          throw new ApolloError("password or email incorrect");
        }
        const token = generateToken(matched_doctor);
        return {
          ...matched_doctor._doc,
          id: matched_doctor._id,
          token,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    async front_desk_officer_login(_, { email, password }) {
      const { valid, errors } = validateAdminLoginInput(email, password);
      if (!valid) {
        throw new UserInputError("Error", {
          errors: { errors },
        });
      }

      try {
        const matched_FDO = await Front_Desk_Officer.findOne({ email });
        if (!matched_FDO) {
          throw new ApolloError("Admin not found, try again!");
        }
        const ismatched = bcrypt.compare(password, matched_FDO.password);
        if (!ismatched) {
          throw new ApolloError("password or email incorrect");
        }
        const token = generateToken(matched_FDO);
        return {
          ...matched_FDO._doc,
          id: matched_FDO._id,
          token,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
