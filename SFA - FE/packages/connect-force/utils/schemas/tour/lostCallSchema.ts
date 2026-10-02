import * as Yup from "yup";

export const lostCallValidationSchema = Yup.object().shape({
  lostCallReasonUId: Yup.mixed()
    .required("Lost Call Reason is required")
    .notOneOf([""], "Lost Call Reason is required"),
});
