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
    created_appointments: [ID!]!
    token: String!
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
  input Register_Super_Admin {
    first_name: String!
    last_name: String!
    username: String!
    email: String!
    phone_number: String!
    password: String!
    confirm_password: String!
  }

  input Register_Admin {
    first_name: String!
    last_name: String!
    email: String!
    phone_number: String!
    user_type: String!
    user_role: String!
    password: String!
    confirm_password: String!
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
    token: String!
  }
  type Appointment {
    _id: ID!
    doctor: String!
    time: String!
    date: String!
    body: String!
    creator: Admin!
  }
  type Booking {
    _id: ID
    appointment: Appointment!
    patient: Patient!
    createdAt: String!
    updatedAt: String!
  }
  type Admin {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    phone_number: String!
    password: String!
    confirm_password: String!
    user_type: String!
    user_role: String!
    created_appointment: [Appointment!]
  }

  # Query
  type Query {
    getPatients: [Patient]
    get_admins: [Admin!]
    get_appointments: [Appointment!]
    get_appointments_by_id(id: ID!): [Appointment]
    get_booking: [Booking!]
  }

  # Mutations

  type Mutation {
    register_patient(register_Patient: register_Patient): Patient!
    register_super_admin(register_Super_Admin: Register_Super_Admin): Status!
    register_admin(Register_Admin: Register_Admin): Admin!
    patient_login(clinic_name: String!, otp: String!, patient_id: ID!): Patient!
    super_admin_login(email: String!, password: String!): Status!
    admin_login(email: String!, password: String!): Status!

    create_appointment(
      user_id: ID!
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
    book_appointment(appointment_id: ID!): Booking!
  }
`;
