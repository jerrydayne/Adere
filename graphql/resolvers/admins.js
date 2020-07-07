const Admin = require("../../models/Admins");
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
  Query: {
    async get_admins() {
      const admins = await Admin.find().populate("created_appointment");
      const admin = admins.map((admin) => {
        return {
          ...admin._doc,
          _id: admin.id,
        };
      });

      return admin;
    },
  },
  Mutation: {
    async register_admin(
      _,
      {
        Register_Admin: {
          first_name,
          last_name,
          email,
          phone_number,
          user_type,
          user_role,
          password,
          confirm_password,
        },
      },
      context
    ) {
      const user = check_auth(context);
      const { valid, errors } = validateAdminInput(
        first_name,
        last_name,
        email,
        phone_number,
        password,
        confirm_password
      );
      if (!valid) {
        throw new UserInputError("Error", { error: { errors } });
      }
      if (user_role.trim() === "") {
        throw new UserInputError("set user role");
      }
      if (user_type.trim() === "") {
        throw new UserInputError("set user type");
      }
      if (password !== confirm_password) {
        throw new UserInputError("password do not match");
      }
      const created_admin = await Admin.findOne({ email });
      if (created_admin) {
        throw new ApolloError("Admin already exist");
      }
      try {
        const hashed_password = await bcrypt.hash(password, 12);
        if (user.user_role === "super_admin") {
          const admin = await Admin.findOne({ email });
          if (admin) {
            throw new ApolloError("admin already exist");
          }
          const new_admin = new Admin({
            first_name,
            last_name,
            email,
            phone_number,
            password: hashed_password,
          });

          new_admin.user_role = user_role;
          new_admin.user_type = user_type;
          const admins = await new_admin.save();
          return {
            ...admins._doc,
            id: admins._id,
          };
        } else {
          throw new ApolloError("You are not authorized for this operation");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async admin_login(_, { email, password }) {
      const { valid, errors } = validateAdminLoginInput(email, password);
      if (!valid) {
        throw new UserInputError("Error", {
          errors: { errors },
        });
      }

      try {
        const matched_admin = await Admin.findOne({ email });
        if (!matched_admin) {
          throw new ApolloError("Admin not found, try again!");
        }
        const ismatched = await bcrypt.compare(
          password,
          matched_admin.password
        );
        if (!ismatched) {
          throw new ApolloError("password or email incorrect");
        }
        const token = generateToken(matched_admin);
        return {
          ...matched_admin._doc,
          id: matched_admin._id,
          token,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
