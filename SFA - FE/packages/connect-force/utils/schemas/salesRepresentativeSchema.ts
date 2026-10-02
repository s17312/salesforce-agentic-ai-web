import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

const currentYear = new Date().getFullYear();

export const salesRepresentativeValidationSchema = Yup.object().shape({
  representativeID: Yup.string()
    .required("Code is required")
    .matches(/^[^\s]+$/, "Middle spaces are not allowed")
    .matches(/^[A-Za-z0-9]+$/, "Special characters are not allowed")
    .transform((value) => (value ? value.trim() : value))
    .min(3, MINIMUM_MSG(3))
    .max(10, MAXIMUM_MSG(10)),
  name: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50))
    .min(3, MINIMUM_MSG(3)),
  addressLine1: Yup.string()
    .required("Address Line 1 is required")
    .transform((value) => (value ? value.trim() : value))
    .max(100, MAXIMUM_MSG(100))
    .min(1, MINIMUM_MSG(1)),
  addressLine2: Yup.string()
    .optional()
    .nullable()
    .test("max-length", MAXIMUM_MSG(100), (value) => {
      if (!value) return true;
      const trimmedName = value.replace(/\s+/g, " ").trim();
      return trimmedName.length <= 100;
    }),
  addressLine3: Yup.string()
    .optional()
    .nullable()
    .test("max-length", MAXIMUM_MSG(100), (value) => {
      if (!value) return true;
      const trimmedName = value.replace(/\s+/g, " ").trim();
      return trimmedName.length <= 100;
    }),
  contactNo: Yup.string()
    .required("Phone is required")
    .notOneOf([""], "Phone is required")
    .test("min-length", "Must be at least 3 digits long", function (value) {
      const { phoneCountryCode } = this.parent;
      const sanitizedValue = value ? value.replace(/\s+/g, "") : "";
      const minDigits = 3;
      const countryCodeLength = phoneCountryCode ? phoneCountryCode.length : 0;
      const minLength = sanitizedValue.length - countryCodeLength;
      return value ? minLength >= minDigits : false;
    }),
  nic: Yup.string()
    .nullable()
    .optional()
    .transform((value) => (value ? value.trim() : value))
    .test("max-length", MAXIMUM_MSG(12), (value) => {
      if (!value) return true;
      const trimmedName = value.replace(/\s+/g, " ").trim();
      return trimmedName.length <= 12;
    })
    .test("min-length", MINIMUM_MSG(10), (value) => {
      if (!value) return true; // Allow empty value
      const word = value.replace(/\s+/g, " ").trim();
      return word.length >= 10;
    }),
  email: Yup.string()
    .required("Email Address is required")
    .email("Must be a valid email")
    .min(3, MINIMUM_MSG(3))
    .max(100, MAXIMUM_MSG(100))
    .test("no-spaces", "Spaces are not allowed", (value) => {
      if (!value) return true; // Allow empty value
      return !/\s/.test(value); // Check for spaces
    }),
  dateOfBirth: Yup.date()
    .nullable()
    .optional()
    .test(
      "year-format",
      "Please provide a valid date for the Date of Birth",
      (value) => {
        if (!value) return true;
        const year = value.getFullYear().toString();
        return year.length === 4;
      }
    )
    .test("no-future-dates", "Future dates are not allowed", (value) => {
      if (!value) return true;
      const dateValue = new Date();
      return value.getTime() < dateValue.getTime();
    })
    .typeError("Please provide a valid date for the Date of Birth"),

  reference: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .max(255, MAXIMUM_MSG(255)),
  distributorUId: Yup.mixed()
    .required("Distributor Assignment is required")
    .notOneOf([""], "Distributor Assignment is required"),
});
