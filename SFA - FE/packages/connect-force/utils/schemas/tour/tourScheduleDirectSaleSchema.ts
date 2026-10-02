import * as Yup from "yup";

export const tourScheduleDirectSaleSchema = Yup.object().shape({
  distributorUId: Yup.string().required("Required"),
  representativeUId: Yup.string().required("Required"),
  routeUIds: Yup.string().required("Required"),
  outletUId: Yup.string().required("Required"),
});
