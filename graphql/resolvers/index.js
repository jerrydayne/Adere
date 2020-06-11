const patientResolver = require("./patient");

module.exports = {
  Query: {
    ...patientResolver.Query,
  },
  Mutation: {
    ...patientResolver.Mutation,
  },
};
