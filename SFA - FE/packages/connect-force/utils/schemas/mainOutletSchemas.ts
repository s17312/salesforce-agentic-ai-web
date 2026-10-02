import * as Yup from "yup";
import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";

export const mainOutletValidationSchema = Yup.object().shape({
  outletID: Yup.string()
    .trim()
    .required("Parent Outlet Code is required")
    .matches(/^[^\s]+$/, "Spaces are not allowed.")
    .test("min-length", MINIMUM_MSG(3), (value) => {
      if (!value) return false;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length >= 3;
    })
    .test("max-length", MAXIMUM_MSG(10), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 10;
    }),
  name: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .max(100, MAXIMUM_MSG(100))
    .min(3, MINIMUM_MSG(3)),
  address: Yup.string()
    .trim()
    .required("Address is required")
    .test("min-length", MINIMUM_MSG(1), (value) => {
      if (!value) return false;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length >= 1;
    })
    .test("max-length", MAXIMUM_MSG(100), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 100;
    }),
  addressLine1: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .test("min-length", MINIMUM_MSG(1), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length >= 1;
    })
    .test("max-length", MAXIMUM_MSG(100), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 100;
    }),
  addressLine2: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .test("min-length", MINIMUM_MSG(1), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length >= 1;
    })
    .test("max-length", MAXIMUM_MSG(100), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 100;
    }),
  contactNo: Yup.string()
    .trim()
    .required("Contact No 1 is required")
    .notOneOf([""], "Contact No 1 is required")
    .test("min-length", "Must be at least 3 digits long", function (value) {
      const { contactNo1CountryCode } = this.parent;
      const sanitizedValue = value ? value.replace(/\s+/g, "") : "";
      const minDigits = 3;
      const countryCodeLength = contactNo1CountryCode
        ? contactNo1CountryCode.length
        : 0;
      const minLength = sanitizedValue.length - countryCodeLength;
      return value ? minLength >= minDigits : false;
    })
    .test("max-length", MAXIMUM_MSG(17), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 17;
    }),
  brNo: Yup.string()
    .trim()
    .nullable()
    .test("min-length", MINIMUM_MSG(12), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length >= 12;
    })
    .test("max-length", MAXIMUM_MSG(21), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 21;
    }),
  vatNo: Yup.string()
    .trim()
    .nullable()
    .test(
      "valid-format",
      "VAT must start with 2 capital letters followed by up to 16 digits",
      (value) => {
        if (!value) return true;
        const trimmedValue = value.replace(/\s+/g, " ").trim();
        if (trimmedValue.length >= 6 && trimmedValue.length <= 18) {
          return /^[A-Z]{2}[0-9]{4,16}$/.test(trimmedValue);
        }
        return true;
      }
    )
    .test("min-length", MINIMUM_MSG(6), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length >= 6;
    })
    .test("max-length", MAXIMUM_MSG(18), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 18;
    }),
  motherCompanyAddress: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .test("min-length", MINIMUM_MSG(1), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length >= 1;
    })
    .test("max-length", MAXIMUM_MSG(100), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 100;
    }),
  motherCompanyAddressLine1: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .test("min-length", MINIMUM_MSG(1), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length >= 1;
    })
    .test("max-length", MAXIMUM_MSG(100), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 100;
    }),
  motherCompanyAddressLine2: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .test("min-length", MINIMUM_MSG(1), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length >= 1;
    })
    .test("max-length", MAXIMUM_MSG(100), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 100;
    }),
  ownerName: Yup.string()
    .trim()
    .nullable()
    .test("max-length", MAXIMUM_MSG(30), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 30;
    }),
  ownerNIC: Yup.string()
    .trim()
    .nullable()
    .test("max-length", MAXIMUM_MSG(12), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 12;
    }),
  ownerContactNo: Yup.string()
    .trim()
    .nullable()
    .test("min-length", MINIMUM_MSG(3), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length >= 3;
    })
    .test("max-length", MAXIMUM_MSG(17), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 17;
    }),
});
