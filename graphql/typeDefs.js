const { gql } = require("apollo-server");

module.exports = gql`
  type Patient {
    id: ID!
    first_name: String!
    last_name: String!
    other_name: String!
    email: String!
    phone_number: String!
    address: String!
    occupation: String!
    relationship: String!
    age: String!
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
    care_entry_point: String!
    date_of_confirmed_HIV_test: String!
    mode_of_HIV_test: String!
    where: String!
    prior_ART: String!
    date_transferred_in: String!
    facility_transferred_from: String!
    otp: String!
    appointments: [ID!]!
    token: String!
  }
  type Front_Desk_Officer {
    id: ID!
    first_name: String!
    last_name: String!
    username: String!
    email: String!
    phone_number: String!
    user_type: String!
    user_role: String!
    appointments: [ID!]!
  }
  input register_Patient {
    first_name: String!
    last_name: String!
    other_name: String!
    email: String!
    phone_number: String!
    address: String!
    occupation: String!
    relationship: String!
    age: String!
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
    care_entry_point: String!
    date_of_confirmed_HIV_test: String!
    mode_of_HIV_test: String!
    where: String!
    prior_ART: String!
    date_transferred_in: String!
    facility_transferred_from: String!
    otp: String!
  }
  type Query {
    getPatients: [Patient]
    get_FDO: [Front_Desk_Officer]
    get_appointments: [Appointment]
    get_appointments_by_id(id: ID!): [Appointment]
  }
  input Register_Super_Admin {
    first_name: String!
    last_name: String!
    username: String!
    email: String!
    phone_number: String!
    password: String!
    confirm_password: String!
  }
  input Register_Doctor {
    first_name: String!
    last_name: String!
    username: String!
    email: String!
    phone_number: String!
    password: String!
    confirm_password: String!
  }
  input Register_Front_Desk_Officer {
    first_name: String!
    last_name: String!
    username: String!
    email: String!
    phone_number: String!
    password: String!
    confirm_password: String!
  }
  type Admin {
    id: ID!
    first_name: String!
    last_name: String!
    username: String!
    email: String!
    phone_number: String!
    user_type: String!
    user_role: String!
    token: String
    message: String!
  }
  type Status {
    id: ID!
    first_name: String!
    last_name: String!
    username: String!
    email: String!
    phone_number: String!
    user_type: String!
    user_role: String!
    message: String!
  }
  type Appointment {
    id: ID!
    doctor: String!
    by: [ID]!
    time: String!
    date: String!
    body: String!
  }

  # Mutations

  type Mutation {
    register_patient(register_Patient: register_Patient): Patient!
    register_super_admin(register_Super_Admin: Register_Super_Admin): Status!
    register_doctor(Register_Doctor: Register_Doctor): Status!
    register_front_desk_officer(
      Register_Front_Desk_Officer: Register_Doctor
    ): Status!
    patient_login(clinic_name: String!, otp: String!, patient_id: ID!): Patient!
    super_admin_login(email: String!, password: String!): Admin!
    doctor_login(email: String!, password: String!): Admin
    front_desk_officer_login(email: String!, password: String!): Admin!
    create_fdo_Appointment(
      fdo_id: ID!
      body: String!
      time: String!
      doctor: String!
    ): Appointment!
    create_patient_Appointment(
      patient_id: ID!
      body: String!
      time: String!
      doctor: String!
    ): Appointment!
    update_appointment(
      appointment_id: ID!
      body: String!
      time: String!
      doctor: String!
    ): Appointment!
    delete_appointment(appointment_id: ID!): Appointment!
  }
`;
