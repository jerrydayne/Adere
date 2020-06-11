const { gql } = require("apollo-server");

module.exports = gql`
  type Patient {
    id: ID!
    first_name: String!
    last_name: String!
    other_name: String!
    email: String!
    phone_number: String!
    sex: String!
    dob: String!
    educational_status: String!
    marital_status: String!
    next_of_kin: String!
    next_of_kin_phone_number: String!
    clinic_name: String!
    clinic_number: String!
    location: String!
    patient_id: String!
    date_enrolled: String!
    otp: String!
    token: String!
  }

  type Query {
    getPatients: [Patient]
  }
  input registerInput {
    first_name: String!
    last_name: String!
    other_name: String!
    email: String!
    phone_number: String!
    sex: String!
    dob: String!
    educational_status: String!
    marital_status: String!
    next_of_kin: String!
    next_of_kin_phone_number: String!
    clinic_name: String!
    clinic_number: String!
    location: String!
    patient_id: String!
    date_enrolled: String!
    otp: String!
  }

  type Mutation {
    register(registerInput: registerInput): Patient!
    login(phone_number: String!, otp: String!, patient_id: ID!): Patient!
  }
`;
