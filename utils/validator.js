module.exports = {
  validateUserInput: (
    first_name,
    last_name,
    other_name,
    email,
    phone_number,
    address,
    occupation,
    relationship,
    age,
    sex,
    dob,
    educational_status,
    marital_status,
    next_of_kin,
    next_of_kin_phone_number,
    clinic_name,
    clinic_number,
    location,
    patient_id,
    date_enrolled,
    care_entry_point,
    date_of_confirmed_HIV_test,
    mode_of_HIV_test,
    where,
    prior_ART,
    date_transferred_in,
    facility_transferred_from,
    otp
  ) => {
    const errors = {};
    if (last_name.trim() === "") {
      errors.last_name = " lastname cannot be empty";
    }
    if (first_name.trim() === "") {
      errors.first_name = " firstname cannot be empty";
    }
    if (other_name.trim() === "") {
      errors.other_name = " other name cannot be empty";
    }
    if (email.trim() === "") {
      errors.email = " email cannot be empty";
    } else {
      const RegEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (!email.match(RegEx)) {
        errors.email = " please enter a  valid email address";
      }
    }
    if (phone_number.trim() === "") {
      errors.phone_number = " phone number cannot be empty";
    }

    if (sex.trim() === "") {
      errors.sex = " Sex cannot be empty";
    }
    if (dob.trim() === "") {
      errors.dob = " Date of Birth cannot be empty";
    }
    if (address.trim() === "") {
      errors.address = "Address cannot be empty";
    }
    if (age.trim() === "") {
      errors.age = "age cannot be empty";
    }
    if (relationship.trim() === "") {
      errors.relationship = "relationship cannot be empty";
    }
    if (occupation.trim() === "") {
      errors.occupation = "occupation cannot be empty";
    }
    if (educational_status.trim() === "") {
      errors.educational_status = "Educational status cannot be empty";
    }
    if (marital_status.trim() === "") {
      errors.marital_status = "Marital status cannot be empty";
    }
    if (next_of_kin.trim() === "") {
      errors.next_of_kin = "Next of Kin cannot be empty";
    }
    if (next_of_kin_phone_number.trim() === "") {
      errors.next_of_kin_phone_number =
        "Next of Kin phone number cannot be empty";
    }
    if (clinic_name.trim() === "") {
      errors.clinic_name = "Clinic name cannot be empty ";
    }
    if (clinic_number.trim() === "") {
      errors.clinic_number = "Clinic number cannot be empty ";
    }
    if (patient_id.trim() === "") {
      errors.patient_id = "Patient ID cannot be empty";
    }
    if (location.trim() === "") {
      errors.location = "Location cannot be empty";
    }
    if (date_enrolled.trim() === "") {
      errors.date_enrolled = "Date enrolled cannot be empty";
    }
    if (care_entry_point.trim() === "") {
      errors.care_entry_point = "Care entry point cannot be empty";
    }
    if (date_of_confirmed_HIV_test.trim() === "") {
      errors.date_of_confirmed_HIV_test =
        "Date of confirmed HIV test cannot be empty";
    }
    if (mode_of_HIV_test.trim() === "") {
      errors.mode_of_HIV_test = "mode of HIV test cannot be empty";
    }
    if (where.trim() === "") {
      errors.where = "where field cannot be empty";
    }
    if (prior_ART.trim() === "") {
      errors.prior_ART = "Prior Art cannot be empty";
    }
    if (date_transferred_in.trim() === "") {
      errors.date_transferred_in = "Date transferred in cannot be empty";
    }
    if (facility_transferred_from.trim() === "") {
      errors.facility_transferred_from =
        "Facility transferred from cannot be empty";
    }
    if (otp.trim() === "") {
      errors.otp = "otp field cannot be empty";
    }
    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
  validateLoginInput: (phone_number, otp, patient_id) => {
    const errors = {};
    if (patient_id.trim() === "") {
      errors.patient_id = "Patient ID cannot be empty";
    }
    if (otp.trim() === "") {
      errors.otp = "otp must be provided";
    }
    if (phone_number.trim() === "") {
      errors.phone_number = "phone_number cannot be empty";
    }
    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
  validateAdminInput: (
    first_name,
    last_name,
    email,
    phone_number,
    password,
    confirm_password
  ) => {
    let errors = {};
    if (last_name.trim() === "") {
      errors.last_name = " lastname cannot be empty";
    }
    if (first_name.trim() === "") {
      errors.first_name = " firstname cannot be empty";
    }

    if (email.trim() === "") {
      errors.email = " email cannot be empty";
    } else {
      const RegEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (!email.match(RegEx)) {
        errors.email = " please enter a  valid email address";
      }
    }
    if (phone_number.trim() === "") {
      errors.phone_number = " Phone number cannot be empty";
    }
    if (password.trim() === "") {
      errors.password = " password cannot be empty";
    }
    if (confirm_password.trim() === "") {
      errors.confirm_password = " confirm password cannot be empty";
    }

    return {
      valid: Object.keys(errors).length < 1,
      errors,
    };
  },
  validateAdminLoginInput: (email, password) => {
    let errors = {};
    if (email.trim() === "") {
      errors.email = " email cannot be empty";
    } else {
      const RegEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (!email.match(RegEx)) {
        errors.email = " please enter a  valid email address";
      }
    }
    if (password.trim() === "") {
      errors.password = " password cannot be empty";
    }
    return {
      valid: Object.keys(errors).length < 1,
      errors,
    };
  },
};
