const patientResolver = require("./patient");
const super_adminResolver = require("./super_admin");
const adminResolver = require("./admins");

module.exports = {
  Query: {
    ...patientResolver.Query,
  },
  Mutation: {
    ...patientResolver.Mutation,
    ...super_adminResolver.Mutation,
    ...adminResolver.Mutation,
  },
};
