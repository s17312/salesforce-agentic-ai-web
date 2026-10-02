import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const legalEntityTypeValidationSchema = Yup.object().shape({
  legalEntryTypeId: Yup.string()
    .required("Code is required")
    .matches(/^[^\s]+$/, "Spaces are not allowed")
    .transform((value) => (value ? value.trim() : value))
    .test("min-length", MINIMUM_MSG(3), (value) => {
      if (!value) return true;
      const trimmedCode = value.replace(/\s+/g, " ").trim();
      return trimmedCode.length >= 3;
    })
    .test("max-length", MAXIMUM_MSG(10), (value) => {
      if (!value) return true;
      const trimmedCode = value.replace(/\s+/g, " ").trim();
      return trimmedCode.length <= 10;
    }),
  legalEntryTypeName: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .test("min-length", MINIMUM_MSG(3), (value) => {
      if (!value) return false;
      const legalEntityName = value.replace(/\s+/g, " ").trim();
      return legalEntityName.length >= 3;
    })
    .test("max-length", MAXIMUM_MSG(50), (value) => {
      if (!value) return true;
      const legalEntityName = value.replace(/\s+/g, " ").trim();
      return legalEntityName.length <= 50;
    }),
  description: Yup.string().test("max-length", MAXIMUM_MSG(100), (value) => {
    if (!value) return true;
    const legalEntityDis = value.replace(/\s+/g, " ").trim();
    return legalEntityDis.length <= 100;
  }),
});
