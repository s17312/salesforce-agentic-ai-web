import * as Yup from "yup";
import { MINIMUM_MSG, MAXIMUM_MSG } from "@/data/commons";

export const userProfileCreateValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(3, MINIMUM_MSG(3))
    .max(50, MAXIMUM_MSG(50))
    .matches(
      /^[a-zA-Z ]+$/,
      "First name must not contain special characters or numbers"
    ),
  lastName: Yup.string()
    .required("Last name is required")
    .min(3, MINIMUM_MSG(3))
    .max(50, MAXIMUM_MSG(50))
    .matches(
      /^[a-zA-Z ]+$/,
      "Last name must not contain special characters or numbers"
    ),
  dob: Yup.date()
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth must be in the past"),
  nic: Yup.string()
    .required("Personal ID Number is required")
    .matches(
      /^(\d{9}[VXvx]|\d{12})$/,
      "Personal ID Number must be either 9 digits followed by 'V' or 'X', or a 12-digit number"
    ),
  address: Yup.string()
    .required("Address Line 1 is required")
    .min(3, MINIMUM_MSG(3))
    .max(100, MAXIMUM_MSG(100)),
  addressLine2: Yup.string().test("max-length", MAXIMUM_MSG(100), (value) => {
    if (!value) return true; // Allow empty value
    const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
    return trimmedName.length <= 100;
  }),
  mobileNumber: Yup.string()
    .required("Mobile number is required")
    .notOneOf(["", "+94"], "Mobile number is required")
    .max(14, "Mobile number must be at least 10 digits"),
  email: Yup.string()
    .required("Email is required")
    .email("Must be a valid email")
    .min(3, MINIMUM_MSG(3))
    .max(100, MAXIMUM_MSG(100))
    .test("no-spaces", "Spaces are not allowed", (value) => {
      if (!value) return true; // Allow empty value
      return !/\s/.test(value); // Check for spaces
    }),
  emergencyContactName: Yup.string()
    .required("Emergency Contact Person Name is required")
    .min(3, MINIMUM_MSG(3))
    .max(50, MAXIMUM_MSG(50))
    .matches(
      /^[a-zA-Z ]+$/,
      "Emergency Contact Person Name must not contain special characters or numbers"
    ),
  emergencyContactNumber: Yup.string()
    .required("Emergency Contact Person Number is required")
    .notOneOf(["", "+94"], "Emergency Contact Person Number is required")
    .max(
      14,
      "Emergency Contact Person Number number must be at least 10 digits"
    ),
  employeeID: Yup.string()
    .required("Employee ID is required")
    .matches(/^[A-Za-z0-9]+$/, "Special characters are not allowed")
    .transform((value) => (value ? value.trim() : value))
    .min(3, MINIMUM_MSG(3))
    .max(10, MAXIMUM_MSG(10)),
  designation: Yup.string()
    .required("Designation is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50))
    .min(3, MINIMUM_MSG(3)),
  epF_ETF_Number: Yup.string()
    .required("EPF/ETF number is required")
    .nullable()
    .trim()
    .test("no-spaces", "Spaces are not allowed", (value) => {
      if (!value) return true;
      return !/\s/.test(value);
    })
    .test("min-length", MINIMUM_MSG(7), (value) => {
      if (!value) return true;
      return value.length >= 7;
    })
    .test("max-length", MAXIMUM_MSG(12), (value) => {
      if (!value) return true;
      return value.length <= 12;
    }),
  appointedDate: Yup.date()
    .required("Appointed Date is required")
    .max(new Date(), "Appointed Date must be in the past"),
  userName: Yup.string()
    .required("Username is required")
    .min(3, MINIMUM_MSG(3))
    .max(30, MAXIMUM_MSG(50))
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  password: Yup.string()
    .required("Password is required")
    .min(6, MINIMUM_MSG(6))
    .max(20, MAXIMUM_MSG(20)),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export const userProfileUpdateValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(3, MINIMUM_MSG(3))
    .max(50, MAXIMUM_MSG(50))
    .matches(
      /^[a-zA-Z ]+$/,
      "First name must not contain special characters or numbers"
    ),
  lastName: Yup.string()
    .required("Last name is required")
    .min(3, MINIMUM_MSG(3))
    .max(50, MAXIMUM_MSG(50))
    .matches(
      /^[a-zA-Z ]+$/,
      "Last name must not contain special characters or numbers"
    ),
  dob: Yup.date()
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth must be in the past"),

  nic: Yup.string()
    .required("Personal ID Number is required")
    .matches(
      /^(\d{9}[VXvx]|\d{12})$/,
      "Personal ID Number must be either 9 digits followed by 'V' or 'X', or a 12-digit number"
    ),
  address: Yup.string()
    .required("Address Line 1 is required")
    .min(3, MINIMUM_MSG(3))
    .max(100, MAXIMUM_MSG(100)),
  addressLine2: Yup.string().test("max-length", MAXIMUM_MSG(100), (value) => {
    if (!value) return true; // Allow empty value
    const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
    return trimmedName.length <= 100;
  }),
  mobileNumber: Yup.string()
    .required("Mobile number is required")
    .notOneOf(["", "+94"], "Mobile number is required")
    .max(14, "Mobile number must be at least 10 digits"),
  email: Yup.string()
    .required("Email is required")
    .email("Must be a valid email")
    .min(3, MINIMUM_MSG(3))
    .max(100, MAXIMUM_MSG(100))
    .test("no-spaces", "Spaces are not allowed", (value) => {
      if (!value) return true;
      return !/\s/.test(value);
    }),
  emergencyContactName: Yup.string()
    .required("Emergency Contact Person Name is required")
    .min(3, MINIMUM_MSG(3))
    .max(50, MAXIMUM_MSG(50))
    .matches(
      /^[a-zA-Z ]+$/,
      "Emergency Contact Person Name must not contain special characters or numbers"
    ),
  emergencyContactNumber: Yup.string()
    .required("Emergency Contact Person Number is required")
    .notOneOf(["", "+94"], "Emergency Contact Person Number is required")
    .max(
      14,
      "Emergency Contact Person Number number must be at least 10 digits"
    ),
  employeeID: Yup.string()
    .required("Employee ID is required")
    .matches(/^[A-Za-z0-9]+$/, "Special characters are not allowed")
    .transform((value) => (value ? value.trim() : value))
    .min(3, MINIMUM_MSG(3))
    .max(10, MAXIMUM_MSG(10)),
  designation: Yup.string()
    .required("Designation is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50))
    .min(3, MINIMUM_MSG(3)),
  epF_ETF_Number: Yup.string()
    .required("EPF/ETF number is required")
    .nullable()
    .trim()
    .test("no-spaces", "Spaces are not allowed", (value) => {
      if (!value) return true;
      return !/\s/.test(value);
    })
    .test("min-length", MINIMUM_MSG(7), (value) => {
      if (!value) return true;
      return value.length >= 7;
    })
    .test("max-length", MAXIMUM_MSG(12), (value) => {
      if (!value) return true;
      return value.length <= 12;
    }),
  appointedDate: Yup.date()
    .required("Appointed Date is required")
    .typeError("Please provide a valid date for the appointed date")
    .test("no-future-dates", "Future dates are not allowed", (value) => {
      if (value) {
        const dateValue = new Date();
        return value.getTime() < dateValue.getTime();
      } else {
        return false;
      }
    }),
  userName: Yup.string()
    .required("Username is required")
    .min(3, MINIMUM_MSG(3))
    .max(30, MAXIMUM_MSG(50))
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
});
