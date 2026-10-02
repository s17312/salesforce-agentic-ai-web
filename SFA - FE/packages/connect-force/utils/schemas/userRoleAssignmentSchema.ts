import * as Yup from "yup";

export const createUserRoleAssignmentSchema = (
  userRoleTypes: Array<{ uId: number; roleTypeName: string }>,
  userRoleList: Array<{
    uId: number;
    roleName: string;
    roleTypeModel?: { uId: number; roleTypeName: string } | null;
  }>
) => {
  return Yup.object().shape({
    userDetailsUId: Yup.number().required("User is required"),
    userRoleUId: Yup.number().required("User role is required"),

    companyUId: Yup.number()
      .nullable()
      .when("userRoleUId", {
        is: (userRoleUId: number) => {
          const role = userRoleList.find((r) => r.uId === userRoleUId);
          const roleType = role?.roleTypeModel?.roleTypeName;
          return (
            roleType &&
            ["Company", "Distributor", "Supervisor", "Sales Rep"].includes(
              roleType
            )
          );
        },
        then: (schema) => schema.required("Company is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    distributorUIds: Yup.mixed()
      .nullable()
      .when("userRoleUId", {
        is: (userRoleUId: number) => {
          const role = userRoleList.find((r) => r.uId === userRoleUId);
          const roleType = role?.roleTypeModel?.roleTypeName;
          return (
            roleType &&
            ["Distributor", "Supervisor", "Sales Rep"].includes(roleType)
          );
        },
        then: (schema) =>
          schema.test(
            "is-valid-distributor",
            "Distributor is required",
            (value) => (Array.isArray(value) ? value.length > 0 : !!value)
          ),
        otherwise: (schema) => schema.notRequired(),
      }),

    representativeUIds: Yup.mixed()
      .nullable()
      .when("userRoleUId", {
        is: (userRoleUId: number) => {
          const role = userRoleList.find((r) => r.uId === userRoleUId);
          const roleType = role?.roleTypeModel?.roleTypeName;
          return roleType && ["Supervisor", "Sales Rep"].includes(roleType);
        },
        then: (schema) =>
          schema.test("is-valid-rep", "Representative is required", (value) =>
            Array.isArray(value) ? value.length > 0 : !!value
          ),
        otherwise: (schema) => schema.notRequired(),
      }),
  });
};
