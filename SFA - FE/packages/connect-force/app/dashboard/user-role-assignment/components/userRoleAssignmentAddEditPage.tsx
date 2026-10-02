import FormProvider, { RHFAutocompleteField } from "@/components/hook-form";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setUserRoleAssignmentError,
  setUserRoleAssignmentMessage,
} from "@/redux/slices/user-management/user-role-assignment-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllCompany } from "@/service/company.service";
import {
  createUserRoleAssignment,
  getAllActiveRepByDistriID,
  getAllUserProfileDetails,
  getDistributorsByCompanyUId,
  updateUserRoleAssignment,
} from "@/service/user-management/userRoleAssignment.service";
import {
  getAllUserRolesDetails,
  getAllUserRoleTypeDetails,
} from "@/service/userRole.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  FormValuesPropsUserRoleAssignment,
  UserRoleAssignment,
} from "@/types/user-management/user-role-assignment-types";
import { createUserRoleAssignmentSchema } from "@/utils/schemas/userRoleAssignmentSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { isEqual } from "lodash";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  currentUserRoleAssignment?: UserRoleAssignment | any;
  isEdit?: boolean;
};

export default function UserRoleAssignmentAddEditPage({
  currentUserRoleAssignment,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [selectedDistributorId, setSelectedDistributorId] = useState<number[]>(
    []
  );

  // const defaultValues = useMemo(
  //   () => ({
  //     userDetailsUId: currentUserRoleAssignment?.userDetailsUId || null,
  //     userRoleUId: currentUserRoleAssignment?.userRoleUId || null,
  //     companyUId: currentUserRoleAssignment?.companyUId || null,
  //     distributorUIds: currentUserRoleAssignment?.distributorUIds[0] || null,
  //     representativeUIds: currentUserRoleAssignment?.representativeUIds || [],
  //   }),
  //   [currentUserRoleAssignment]
  // );

  const userProfileList = useSelector(
    (state) => state.userProfileSlice.userProfileDetails
  );
  const userRoleList = useSelector(
    (state) => state.userRoleSlice.userRoleDetails
  );
  const companyList = useSelector((state) => state.companySlice.companies);
  const distributorList = useSelector(
    (state) => state.userRoleAssignmentSlice.distributorView
  );
  const { userRoleTypes: userRoleTypes } = useSelector(
    (state) => state.userRoleSlice
  );
  const representativeList = useSelector(
    (state) => state.userRoleAssignmentSlice.repBydistri
  );
  const responseMessage = useSelector(
    (state) => state.userRoleAssignmentSlice.message
  );
  const responseError = useSelector(
    (state) => state.userRoleAssignmentSlice.error
  );

  const defaultValues = useMemo(() => {
    const role = userRoleList.find(
      (role) => role.uId === currentUserRoleAssignment?.userRoleUId
    );
    const isSalesRep = role?.roleName === "Sales Rep";
    const isSupervisor = role?.roleName === "Supervisor";

    return {
      userDetailsUId: currentUserRoleAssignment?.userDetailsUId || null,
      userRoleUId: currentUserRoleAssignment?.userRoleUId || null,
      companyUId: currentUserRoleAssignment?.companyUId || null,
      distributorUIds: currentUserRoleAssignment?.distributorUIds[0] || null,
      representativeUIds:
        isSalesRep && currentUserRoleAssignment?.representativeUIds?.length
          ? currentUserRoleAssignment.representativeUIds[0]
          : isSupervisor
          ? currentUserRoleAssignment?.representativeUIds || []
          : [],
    };
  }, [currentUserRoleAssignment, userRoleList]);

  useEffect(() => {
    if (isEdit && currentUserRoleAssignment) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUserRoleAssignment]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setUserRoleAssignmentMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setUserRoleAssignmentError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  const fetchData = async () => {
    try {
      await Promise.all([getAllUserRoleTypeDetails()]);
    } catch (error) {
      enqueueSnackbar(`Error in getting data`, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validationSchema = useMemo(
    () => createUserRoleAssignmentSchema(userRoleTypes, userRoleList),
    [userRoleTypes, userRoleList] // Recreate only when userRoleList changes
  );

  const methods = useForm<FormValuesPropsUserRoleAssignment>({
    //@ts-ignore
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: "all",
  });

  const {
    handleSubmit,
    reset,
    formState,
    getValues,
    control,
    watch,
    setValue,
  } = methods;

  const watchRoleId = watch("userRoleUId");
  const watchCompanyId = watch("companyUId");
  const watchDistributorIds = watch("distributorUIds");

  useEffect(() => {
    setSelectedRoleId(watchRoleId ?? null);
  }, [watchRoleId]);

  useEffect(() => {
    setSelectedCompanyId(watchCompanyId ?? null);
  }, [watchCompanyId]);

  useEffect(() => {
    setSelectedDistributorId(watchDistributorIds ?? []);
  }, [watchDistributorIds]);

  const selectedRole = userRoleList.find((role) => role.uId === selectedRoleId);
  const selectedRoleTypeName = selectedRole?.roleTypeModel?.roleTypeName;

  //fetch User Options
  const fetchUserOptions = async () => {
    try {
      await getAllUserProfileDetails(true);
    } catch (error) {
      console.error("Error fetching rep options:", error);
    }
  };

  //fetch User Role Options
  const fetchUserRoleOptions = async () => {
    try {
      await getAllUserRolesDetails(
        undefined,
        undefined,
        undefined,
        "uId",
        "desc",
        true
      );
    } catch (error) {
      console.error("Error fetching rep options:", error);
    }
  };

  //fetch Company Options
  const fetchCompanyData = async () => {
    try {
      await getAllCompany(undefined, undefined, undefined, "uId", "desc", true);
    } catch (error) {
      console.error("error", error);
    }
  };

  // distributorOptions
  const fetchDistributorData = async (companyId: any) => {
    try {
      await getDistributorsByCompanyUId(companyId);
    } catch (error) {
      console.error("error", error);
    }
  };

  //fetch Representative Options
  const fetchRepOptions = async (distributorId: number) => {
    try {
      await getAllActiveRepByDistriID(distributorId);
    } catch (error) {
      console.error("Error fetching rep options:", error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
    fetchUserRoleOptions();
    fetchUserOptions();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchDistributorData(selectedCompanyId);
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    if (Array.isArray(selectedDistributorId)) {
      if (selectedDistributorId.length === 1) {
        fetchRepOptions(selectedDistributorId[0]);
      }
    } else if (typeof selectedDistributorId === "number") {
      fetchRepOptions(selectedDistributorId);
    }
  }, [selectedDistributorId]);

  const mapListToOptions = useCallback(
    (list: any[], labelKey: string, valueKey: string) =>
      list.map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
      })),
    []
  );

  const usersOptions = useMemo(
    () => mapListToOptions(userProfileList, "userName", "userDetailsUId"),
    [userProfileList, mapListToOptions]
  );
  const usersRoleOptions = useMemo(
    () => mapListToOptions(userRoleList, "roleName", "uId"),
    [userRoleList, mapListToOptions]
  );
  const companiesOptions = useMemo(
    () => mapListToOptions(companyList, "companyName", "uId"),
    [companyList, mapListToOptions]
  );
  const distributorsOptions = useMemo(
    () =>
      mapListToOptions(distributorList, "distributorName", "distributorUId"),
    [distributorList, mapListToOptions]
  );
  const representativeOptions = useMemo(
    () => mapListToOptions(representativeList, "name", "uId"),
    [representativeList, mapListToOptions]
  );

  const handleRoleChange = () => {
    reset({
      userDetailsUId: getValues("userDetailsUId"),
      userRoleUId: getValues("userRoleUId"),
      companyUId: null,
      distributorUIds: [],
      representativeUIds: [],
    });
  };

  const handleCompanyChange = () => {
    reset({
      userDetailsUId: getValues("userDetailsUId"),
      userRoleUId: getValues("userRoleUId"),
      companyUId: getValues("companyUId"),
      distributorUIds: [],
      representativeUIds: [],
    });
  };

  const handleDistributorChange = () => {
    reset({
      userDetailsUId: getValues("userDetailsUId"),
      userRoleUId: getValues("userRoleUId"),
      companyUId: getValues("companyUId"),
      distributorUIds: getValues("distributorUIds"),
      representativeUIds: [],
    });
  };

  const buildPayload = (values: FormValuesPropsUserRoleAssignment): any => {
    const {
      userDetailsUId,
      userRoleUId,
      companyUId,
      distributorUIds,
      representativeUIds,
    } = values;

    // Get selected role name from userRoleList using userRoleUId
    const selectedRole = userRoleList.find((role) => role.uId === userRoleUId)
      ?.roleTypeModel?.roleTypeName;

    const basePayload: any = {
      userDetailsUId,
      userRoleUId,
    };

    if (selectedRole === "Company") {
      basePayload.companyUId = companyUId;
    }

    if (selectedRole === "Distributor") {
      basePayload.companyUId = companyUId;
      basePayload.distributorUIds = Array.isArray(distributorUIds)
        ? distributorUIds
        : [distributorUIds];
    }

    if (selectedRole === "Supervisor" || selectedRole === "Sales Rep") {
      basePayload.companyUId = companyUId;
      basePayload.distributorUIds = Array.isArray(distributorUIds)
        ? distributorUIds
        : [distributorUIds];
      basePayload.representativeUIds = Array.isArray(representativeUIds)
        ? representativeUIds
        : [representativeUIds];
    }

    return basePayload;
  };

  const handleCreateUserRoleAssignment = async (
    data: FormValuesPropsUserRoleAssignment
  ) => {
    const payload = buildPayload(data);

    try {
      await createUserRoleAssignment(payload);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.userRoleAssignment.list);
    } catch (error: any) {}
  };

  const handleUpdateUserRoleAssignment = async (
    data: FormValuesPropsUserRoleAssignment
  ) => {
    const payload = buildPayload(data);
    try {
      await updateUserRoleAssignment(currentUserRoleAssignment.uId, payload);
      router.push(PATH_DASHBOARD.userRoleAssignment.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.userRoleAssignment.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateUserRoleAssignment)
          : handleSubmit(handleUpdateUserRoleAssignment)
      }
    >
      <Grid item xs={12} sx={{ mb: 3, position: "relative" }}>
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="Asset Brand Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              User Role Assignment Details
            </Typography>
          </AccordionSummary>

          <Box
            sx={{ mx: 12, mb: 3 }}
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFAutocompleteField
              name="userDetailsUId"
              placeholder="User*"
              options={usersOptions}
              control={control}
            />
            <RHFAutocompleteField
              name="userRoleUId"
              placeholder="Role*"
              options={usersRoleOptions}
              control={control}
              onChange={handleRoleChange}
            />
            {/* Company Field for all except Super Admin */}
            {selectedRoleTypeName && selectedRoleTypeName !== "Super Admin" && (
              <RHFAutocompleteField
                name="companyUId"
                placeholder="Company*"
                options={companiesOptions}
                control={control}
                onChange={handleCompanyChange}
              />
            )}

            {/* Distributor Field for Distributor, Supervisor, Sales Rep */}
            {["Distributor", "Supervisor", "Sales Rep"].includes(
              selectedRoleTypeName || ""
            ) && (
              <RHFAutocompleteField
                name="distributorUIds"
                placeholder="Distributor*"
                options={distributorsOptions}
                control={control}
                disabled={selectedCompanyId == null}
                onChange={handleDistributorChange}
              />
            )}

            {/* Representative Field for Supervisor, Sales Rep */}
            {["Supervisor"].includes(selectedRoleTypeName || "") && (
              <RHFAutocompleteCheckboxField
                name="representativeUIds"
                placeholder="Representative*"
                options={representativeOptions}
                control={control}
                disabled={
                  !selectedDistributorId || selectedDistributorId.length === 0
                }
              />
            )}

            {/* Representative Field for Supervisor, Sales Rep */}
            {["Sales Rep"].includes(selectedRoleTypeName || "") && (
              <RHFAutocompleteField
                name="representativeUIds"
                placeholder="Representative*"
                options={representativeOptions}
                control={control}
                disabled={
                  !selectedDistributorId || selectedDistributorId.length === 0
                }
              />
            )}
          </Box>
        </Accordion>
        <Box
          sx={{
            width: "100%",
            bgcolor: "#E5E0F5",
            height: "10vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #FFFFFF",
            borderRadius: "15px",
            mt: "15px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              loading={formState.isSubmitting}
              startIcon={<SaveIcon />}
              // disabled={!formState.isDirty}
              sx={{
                color: "#FFFFFF",
                height: "44px",
                px: 4,
                borderRadius: "15px",
                mr: 3,
                border: "2px solid #9fa4d4",
                background: "#070E4D",
                "&:hover": {
                  background: "#2D3675",
                },
              }}
            >
              {isEdit ? "Update" : "Save"}
            </LoadingButton>
            {!isEdit ? (
              <Button
                type="reset"
                variant="outlined"
                onClick={() => reset(defaultValues)}
                sx={{
                  height: "44px",
                  px: 4,
                  borderRadius: "15px",
                  background: "#f7f4fe",
                  border: "2px solid #fbf9ff",
                  "&:hover": {
                    background: "#DED8F2",
                    border: "2px solid #f4f1fc",
                  },
                }}
              >
                Clear
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  height: "44px",
                  px: 4,
                  borderRadius: "15px",
                  background: "#f7f4fe",
                  border: "2px solid #fbf9ff",
                  "&:hover": {
                    background: "#DED8F2",
                    border: "2px solid #f4f1fc",
                  },
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Grid>
    </FormProvider>
  );
}
