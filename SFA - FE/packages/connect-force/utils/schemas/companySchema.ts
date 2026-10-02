import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const companyValidationSchema = Yup.object().shape({
  companyId: Yup.string()
    .trim()
    .required("Code is required")
    .matches(/^[^\s]+$/, "Spaces are not allowed")
    .test("min-length", MINIMUM_MSG(3), (value) => {
      if (!value) return false;
      const companyName = value.replace(/\s+/g, " ").trim();
      return companyName.length >= 3;
    })
    .test("max-length", MAXIMUM_MSG(10), (value) => {
      if (!value) return true;
      const companyName = value.replace(/\s+/g, " ").trim();
      return companyName.length <= 10;
    }),
  companyName: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50))
    .min(3, MINIMUM_MSG(3)),
  legalEntryTypeUId: Yup.mixed()
    .required("Legal Entity Type is required")
    .notOneOf([""], "Legal Entity Type is required"),
  registeredAddress: Yup.string()
    .required("Address Line 1 is required")
    .transform((value) => (value ? value.trim() : value))
    .test("min-length", MINIMUM_MSG(1), (value) => {
      if (!value) return true; // Allow empty value
      const word = value.replace(/\s+/g, " ").trim();
      return word.length >= 1;
    })
    .test("max-length", MAXIMUM_MSG(100), (value) => {
      if (!value) return true; // Allow empty value
      const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
      return trimmedName.length <= 100;
    }),
  addressLine1: Yup.string().test("max-length", MAXIMUM_MSG(100), (value) => {
    if (!value) return true; // Allow empty value
    const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
    return trimmedName.length <= 100;
  }),
  addressLine2: Yup.string().test("max-length", MAXIMUM_MSG(100), (value) => {
    if (!value) return true; // Allow empty value
    const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
    return trimmedName.length <= 100;
  }),
  phoneNo: Yup.string()
    .required("Phone is required")
    .notOneOf([""], "Phone is required")
    .min(7, "Must be at least 3 digits long"),
  email: Yup.string()
    .required("Email address is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Must be a valid email"
    )
    .min(3, MINIMUM_MSG(3))
    .max(100, MAXIMUM_MSG(100))
    .test("no-spaces", "Spaces are not allowed", (value) => {
      if (!value) return true; // Allow empty value
      return !/\s/.test(value); // Check for spaces
    }),
  taxID: Yup.string().test("max-length", MAXIMUM_MSG(10), (value) => {
    if (!value) return true; // Allow empty value
    const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
    return trimmedName.length <= 10;
  }),
  companySize: Yup.string().test("max-length", MAXIMUM_MSG(10), (value) => {
    if (!value) return true; // Allow empty value
    const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
    return trimmedName.length <= 10;
  }),
  industry: Yup.string().test("max-length", MAXIMUM_MSG(50), (value) => {
    if (!value) return true; // Allow empty value
    const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
    return trimmedName.length <= 50;
  }),
  siCcode: Yup.string().optional().max(10, MAXIMUM_MSG(10)),
  comments: Yup.string().optional().max(225, MAXIMUM_MSG(225)),
  vatNo: Yup.string()
    .required("VAT Number is required")
    .trim()
    .matches(
      /^[A-Z]{2}\d+$/,
      "Allow only capital two letters followed by numbers"
    )
    .test("no-spaces", "Spaces are not allowed", (value) => {
      if (!value) return true; // Allow empty value
      return !/\s/.test(value); // Check for spaces
    })
    .test("min-length", MINIMUM_MSG(12), (value) => {
      if (!value) return true; // Allow empty value
      return value.length >= 12;
    })
    .test("max-length", MAXIMUM_MSG(21), (value) => {
      if (!value) return true; // Allow empty value
      return value.length <= 21;
    }),
});
