import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setUserRoleError,
  setUserRoleMessage,
} from "@/redux/slices/user-role-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  createUserRole,
  getAllUserRoleTypeDetails,
  updateUserRole,
} from "@/service/userRole.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { FormValuesPropsUserRole, UserRole } from "@/types/user-role-types";
import { userRoleValidationSchema } from "@/utils/schemas/userRoleSchema";
import { mapListToOptions } from "@/utils/sortUtils";
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
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  currentUserRole?: UserRole | undefined;
  isEdit?: boolean;
};

export default function UserRoleForm({
  currentUserRole,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { userRoleTypes: userRoleTypes } = useSelector(
    (state) => state.userRoleSlice
  );

  const defaultValues = useMemo(
    () => ({
      roleId: currentUserRole?.roleId || "",
      roleName: currentUserRole?.roleName || "",
      roleType: currentUserRole?.roleType || null,
      description: currentUserRole?.description || "",
    }),
    [currentUserRole]
  );

  const responseMessage = useSelector((state) => state.userRoleSlice.message);
  const responseError = useSelector((state) => state.userRoleSlice.error);

  const fetchData = async () => {
    try {
      await Promise.all([getAllUserRoleTypeDetails()]);
    } catch (error) {
      enqueueSnackbar(`Error in getting data`, { variant: "error" });
    }
  };

  useEffect(() => {
    if (isEdit && currentUserRole) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUserRole]);

  useEffect(() => {
    fetchData();
  }, []);

  const roleTypesMap = mapListToOptions(userRoleTypes, "roleTypeName", "uId");

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setUserRoleMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setUserRoleError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesPropsUserRole>({
    //@ts-ignore
    resolver: yupResolver(userRoleValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, control } = methods;

  const handleCreateUserRole = async (data: FormValuesPropsUserRole) => {
    try {
      await createUserRole(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.userRole.list);
    } catch (error: any) {}
  };

  const handleUpdateUserRole = async (data: FormValuesPropsUserRole) => {
    try {
      await updateUserRole(currentUserRole?.uId, data);
      router.push(PATH_DASHBOARD.userRole.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.userRole.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateUserRole)
          : handleSubmit(handleUpdateUserRole)
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
            aria-controls="User Role Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              User Role Details
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
            <RHFTextField name="roleId" label="Code*" />
            <RHFTextField name="roleName" label="Name*" />
            <RHFTextField name="description" label="Description" />
            <RHFAutocompleteField
              name="roleType"
              placeholder="Role Type*"
              options={roleTypesMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
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
              disabled={!formState.isDirty}
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
