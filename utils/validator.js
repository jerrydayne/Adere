module.exports = {
  validateUserInput: (
    first_name,
    last_name,
    other_name,
    email,
    phone_number,
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
    date_enrolled
  ) => {
    const errors = {};
    if (last_name.trim() === "") {
      errors.last_name = " lastname cannot be empty";
    }
    if (first_name.trim() === "") {
      errors.first_name = " firstname cannot be empty";
    }
    if (other_name.trim() === "") {
      errors.other_name = " othername cannot be empty";
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
};
