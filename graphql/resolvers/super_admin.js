const Super_Admin = require("../../models/Super_Admin");
const {
  validateAdminInput,
  validateAdminLoginInput,
} = require("../../utils/validator");
const { UserInputError, ApolloError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const { MY_SECRET } = require("../../configs/jwt");
const jwt = require("jsonwebtoken");

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
    async register_super_admin(
      _,
      {
        register_Super_Admin: {
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
      try {
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
        if (username.trim() === "") {
          throw new UserInputError(" username cannot be empty");
        }
        let existing_admin = await Super_Admin.findOne({ email });
        if (existing_admin) {
          throw new ApolloError("user existing with the email");
        }
        if (password !== confirm_password) {
          throw new UserInputError("passwords do not match, try again!");
        }
        if (password.length < 6) {
          throw new UserInputError("password cannot be less than 6 characters");
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const new_super_admin = new Super_Admin({
          first_name,
          last_name,
          username,
          email,
          phone_number,
          password: hashedPassword,
        });
        new_super_admin.user_type = "admin";
        new_super_admin.user_role = "super_admin";
        let super_admin = await new_super_admin.save();
        let token = generateToken(super_admin);
        return {
          message: "Super Admin registered successfully",
          ...super_admin._doc,
          id: super_admin._id,
          token,
        };
      } catch (err) {
        throw new Error(err);
      }
    },

    async super_admin_login(_, { email, password }, context, info) {
      const { valid, errors } = validateAdminLoginInput(email, password);
      if (!valid) {
        throw new UserInputError("Errors", {
          errors: { errors },
        });
      }
      try {
        const ismatch_super_admin = await Super_Admin.findOne({ email });
        if (!ismatch_super_admin) {
          throw new ApolloError("super admin not found");
        }
        const ismatch_password = await bcrypt.compare(
          password,
          ismatch_super_admin.password
        );
        if (!ismatch_password) {
          throw new ApolloError("password incorrect");
        }
        let super_admin = await Super_Admin.findOne({ email });
        let token = generateToken(super_admin);
        return {
          message: "logged in successful",
          ...super_admin._doc,
          id: super_admin._id,
          token,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
