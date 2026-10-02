import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const distributerValidationSchema = Yup.object().shape({
  distributorID: Yup.string()
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
  distributorName: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50))
    .min(3, MINIMUM_MSG(3)),
  address: Yup.string()
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
  townUId: Yup.mixed().when(
    ["provinceUId", "districtUId"],
    ([provinceUId, districtUId], schema) => {
      return provinceUId && districtUId
        ? schema.required("Town is required").notOneOf([""], "Town is required")
        : schema.nullable();
    }
  ),
  phone: Yup.string()
    .required("Phone number is required")
    .notOneOf(["", "+94"], "Phone number is required")
    .max(14, "Phone number must be at least 10 digits"),
  vatNo: Yup.string()
    .nullable()
    .trim()
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
    .test("no-spaces", "Spaces are not allowed", (value) => {
      if (!value) return true;
      return !/\s/.test(value);
    })
    .test("min-length", MINIMUM_MSG(6), (value) => {
      if (!value) return true;
      return value.length >= 6;
    })
    .test("max-length", MAXIMUM_MSG(18), (value) => {
      if (!value) return true;
      return value.length <= 18;
    }),
  titleUId: Yup.mixed()
    .required("Title is required")
    .notOneOf([""], "Title is required"),
  ownerName: Yup.string()
    .required("Owner Name is required")
    .transform((value) => (value ? value.trim() : value))
    .test("min-length", MINIMUM_MSG(3), (value) => {
      if (!value) return true; // Allow empty value
      const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
      return trimmedName.length >= 3;
    })
    .test("max-length", MAXIMUM_MSG(50), (value) => {
      if (!value) return true; // Allow empty value
      const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
      return trimmedName.length <= 50;
    }),
  ownerAddr: Yup.string()
    .required("Owner Address Line 1 is required")
    .min(1, "character length is less than 1")
    .transform((value) => (value ? value.trim() : value))
    .test("max-length", MAXIMUM_MSG(100), (value) => {
      if (!value) return true; // Allow empty value
      const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
      return trimmedName.length <= 100;
    }),
  ownerAddressLine1: Yup.string().test(
    "max-length",
    MAXIMUM_MSG(100),
    (value) => {
      if (!value) return true; // Allow empty value
      const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
      return trimmedName.length <= 100;
    }
  ),
  ownerAddressLine2: Yup.string().test(
    "max-length",
    MAXIMUM_MSG(100),
    (value) => {
      if (!value) return true; // Allow empty value
      const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
      return trimmedName.length <= 100;
    }
  ),
  ownerTpNo: Yup.string()
    .required("Telephone Number is required")
    .notOneOf(["", "+94"], "Telephone number is required")
    .max(14, "Telephone number must be at least 10 digits"),
  mobileNo: Yup.string()
    .required("Mobile Number is required")
    .notOneOf(["", "+94"], "Mobile number is required")
    .max(14, "Mobile number must be at least 10 digits"),
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
  businessCategoryUId: Yup.mixed()
    .required("Business Category is required")
    .notOneOf([""], "Business Category is required"),
  paymentTermUId: Yup.mixed()
    .required("Payment Term is required")
    .notOneOf([""], "Payment Term is required"),
  priceListAssignmentUIds: Yup.array()
    .of(Yup.number())
    .min(1, "Price List Type Assignment is required")
    .required("Price List Type Assignment is required"),
  priceListAssignmentDefaultUId: Yup.number()
    .nullable()
    .required("Default Price List Type is required"),
  cashAccountAssignmentUIds: Yup.array()
    .of(Yup.number())
    .min(1, "Cash Account Assignment is required")
    .required("Cash Account Assignment is required"),
  cashAccountAssignmentDefaultUId: Yup.number()
    .nullable()
    .required("Default Cash Account is required"),
  chequeAccountAssignmentUIds: Yup.array()
    .of(Yup.number())
    .min(1, "Cheque Account Assignment is required")
    .required("Cheque Account Assignment is required"),
  chequeAccountAssignmentDefaultUId: Yup.number()
    .nullable()
    .required("Default Cheque Account is required"),
  outstandingAccountAssignmentUIds: Yup.array()
    .of(Yup.number())
    .min(1, "Outstanding Account Assignment is required")
    .required("Outstanding Account Assignment is required"),
  outstandingAccountAssignmentDefaultUId: Yup.number()
    .nullable()
    .required("Default Outstanding Account is required"),
});
