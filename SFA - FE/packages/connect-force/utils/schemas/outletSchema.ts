import * as Yup from "yup";
import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
const decimalRegex = /^-?\d+(\.\d+)?$/;
const creditLimitRegex = /^\d{1,10}(\.\d+)?$/;

export const outletValidationSchema = Yup.object().shape({
  outletID: Yup.string()
    .trim()
    .required("Code is required")
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
  // parentOutletUId: Yup.mixed().optional(),
  name: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .max(100, MAXIMUM_MSG(100))
    .min(3, MINIMUM_MSG(3)),
  ownerName: Yup.string()
    .trim()
    .nullable()
    .test("max-length", MAXIMUM_MSG(30), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 30;
    }),
  address: Yup.string()
    .trim()
    .required("Address Line 1 is required")
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
  contactNo1: Yup.string()
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
  contactNo2: Yup.string()
    .trim()
    .nullable()
    .test("min-length", MINIMUM_MSG(3), (value) => {
      if (!value || value.trim().length === 0) return true; // Skip if value is null or empty
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length >= 3;
    })
    .test("max-length", MAXIMUM_MSG(17), (value) => {
      if (!value || value.trim().length === 0) return true; // Skip if value is null or empty
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 17;
    }),
  provinceUId: Yup.mixed()
    .required("Province is required")
    .notOneOf([""], "Province is required"),
  districtUId: Yup.mixed().when(["provinceUId"], ([provinceUId], schema) => {
    return provinceUId
      ? schema
          .required("District is required")
          .notOneOf([""], "District is required")
      : schema.nullable();
  }),
  cityUId: Yup.mixed().when(
    ["provinceUId", "districtUId"],
    ([provinceUId, districtUId], schema) => {
      return provinceUId && districtUId
        ? schema.required("Town is required").notOneOf([""], "Town is required")
        : schema.nullable();
    }
  ),
  outletCategoryUId: Yup.number()
    .required("Outlet Category is required")
    .integer("Outlet Category must be an integer"),
  outletClassificationUId: Yup.number()
    .required("Outlet Classification is required")
    .integer("Outlet Classification must be an integer"),
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
  lat: Yup.string()
    .nullable()
    .test("is-valid-format", "Latitude must be a valid number", (value) => {
      if (value === null || value === undefined || value === "") return true;
      return /^-?\d+(\.\d+)?$/.test(value);
    })
    .test(
      "is-valid-latitude",
      "Latitude must be between -90 and 90",
      (value) => {
        if (!value) return true;
        const numValue = parseFloat(value);
        return numValue >= -90 && numValue <= 90;
      }
    )
    .test("max-length", MAXIMUM_MSG(20), (value) => {
      if (!value) return true;
      return value.toString().length <= 20;
    }),
  long: Yup.string()
    .nullable()
    .test("is-valid-format", "Longitude must be a valid number", (value) => {
      if (value === null || value === undefined || value === "") return true;
      return /^-?\d+(\.\d+)?$/.test(value);
    })
    .test(
      "is-valid-longitude",
      "Longitude must be between -180 and 180",
      (value) => {
        if (!value) return true;
        const numValue = parseFloat(value);
        return numValue >= -180 && numValue <= 180;
      }
    )
    .test("max-length", MAXIMUM_MSG(20), (value) => {
      if (!value) return true;
      return value.toString().length <= 20;
    }),
  qRCode: Yup.string()
    .trim()
    .nullable()
    .test("max-length", MAXIMUM_MSG(50), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 50;
    }),
  isExclusive: Yup.boolean(),
  exclusiveRemark: Yup.string().trim().nullable().max(100, MAXIMUM_MSG(100)),
  outletStatusUId: Yup.number()
    .required("Outlet Status is required")
    .integer("Outlet Status must be an integer"),
  paymentModeUId: Yup.number()
    .required("Payment Mode is required")
    .integer("Payment Mode must be an integer"),
  isDiscountEligible: Yup.boolean().optional(),
  creditLimit: Yup.string()
    .nullable()
    .min(1, MINIMUM_MSG(1))
    .max(5, MAXIMUM_MSG(5)),
  creditInvoiceLimit: Yup.string()
    .nullable()
    .matches(/^\d{0,5}$/, "Must be a whole number with at most 5 digits")
    .max(5, "Must be at most 5 characters"),
  creditDays: Yup.string()
    .nullable()
    .matches(/^\d{0,5}$/, "Must be a whole number with at most 5 digits")
    .max(5, "Must be at most 5 characters"),

  additionalNotes: Yup.string()
    .trim()
    .nullable()
    .test("max-length", MAXIMUM_MSG(100), (value) => {
      if (!value) return true;
      const trimmedValue = value.replace(/\s+/g, " ").trim();
      return trimmedValue.length <= 100;
    }),
  isAssetAvailable: Yup.boolean(),
});
