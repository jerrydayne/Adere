const patient_resolver = require("./patient");
const super_admin_resolver = require("./super_admin");
const admin_resolver = require("./admins");
// const FDO_resolver = require("./FDO");
const appointment_resolver = require("./appointment");

module.exports = {
  Query: {
    ...patient_resolver.Query,
    ...admin_resolver.Query,
    ...appointment_resolver.Query,
  },
  Mutation: {
    ...patient_resolver.Mutation,
    ...super_admin_resolver.Mutation,
    ...admin_resolver.Mutation,
    // ...FDO_resolver.Mutation,
    ...appointment_resolver.Mutation,
  },
};
