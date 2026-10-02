import StatusChip from "@/components/color-chip/Chip";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import { cursorTextDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  FormValuesPropsUserRoleAssignment,
  UserRoleAssignment,
} from "@/types/user-management/user-role-assignment-types";
import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { format, isValid } from "date-fns";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type props = {
  currentUserRoleAssignment: UserRoleAssignment | undefined;
};

export default function UserRoleAssignmentViewPage({
  currentUserRoleAssignment,
}: props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
  const defaultValues = useMemo(
    () => ({
      uId: currentUserRoleAssignment?.uId || "",
      userName: currentUserRoleAssignment?.userName || "",
      roleName: currentUserRoleAssignment?.roleName || "",
      companyName: currentUserRoleAssignment?.companyName || "",
      distributors:
        currentUserRoleAssignment?.distributors
          ?.map((d) => d.value)
          .join(", ") || "",
      representatives:
        currentUserRoleAssignment?.representatives
          ?.map((r) => r.value)
          .join(", ") || "",
      createdBy: currentUserRoleAssignment?.createdBy || "ADMIN",
      modifiedBy: currentUserRoleAssignment?.modifiedBy || "ADMIN",
      creationDate: currentUserRoleAssignment?.creationDate || "",
      modifiedDate: currentUserRoleAssignment?.modifiedDate || "",
    }),
    [currentUserRoleAssignment]
  );

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserRoleAssignment]);

  const methods = useForm<FormValuesPropsUserRoleAssignment>({
    defaultValues,
  });

  const { reset } = methods;

  return (
    <FormProvider methods={methods}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <StatusChip status={currentUserRoleAssignment?.active} />
      </Box>
      <Grid item xs={12} sx={{ mt: 2, mb: 5 }}>
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="User Role Assignment Details"
            id="panel1a-header"
            sx={{
              flexDirection: "row-reverse",
              alignItems: "center",
              "&:hover": {
                cursor: "default !important",
              },
            }}
          >
            <Typography
              variant="body1"
              gutterBottom
              sx={{ ml: 5, mb: 2, fontWeight: 500 }}
            >
              User Role Assignment Details
            </Typography>
          </AccordionSummary>
          <Box
            sx={{ mx: 12, mb: 3 }}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFTextField
              name="userName"
              label="User Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.userName ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="roleName"
              label="Role Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.roleName ? { shrink: true } : { shrink: false }
              }
            />
            {defaultValues.roleName &&
              defaultValues.roleName !== "Super Admin" && (
                <RHFTextField
                  name="companyName"
                  label="Company Name"
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.companyName
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
              )}
            {["Distributor", "Supervisor", "Sales Rep"].includes(
              defaultValues.roleName || ""
            ) && (
              <RHFTextField
                name="distributors"
                label="Distributors"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
                InputLabelProps={
                  defaultValues.distributors
                    ? { shrink: true }
                    : { shrink: false }
                }
              />
            )}
            {["Supervisor", "Sales Rep"].includes(defaultValues.roleName || "") && (
              <RHFTextField
                name="representatives"
                label="Representatives"
                multiline
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
                InputLabelProps={
                  defaultValues.distributors
                    ? { shrink: true }
                    : { shrink: false }
                }
              />
            )}
          </Box>
        </Accordion>
      </Grid>
      <Grid item xs={12} sx={{ mb: 3 }}>
        <Box
          sx={{ mx: 12, mb: 3 }}
          rowGap={2}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(4, 1fr)",
          }}
        >
          <RHFTextField
            name="createdBy"
            label="Created By"
            inputProps={{ readOnly: true }}
            focused
            sx={cursorTextDefault}
            InputLabelProps={
              defaultValues.createdBy ? { shrink: true } : { shrink: false }
            }
          />
          <RHFTextField
            name="creationDate"
            label="Created Date"
            inputProps={{ readOnly: true }}
            focused
            value={
              defaultValues.creationDate &&
              isValid(new Date(defaultValues.creationDate))
                ? format(new Date(defaultValues.creationDate), dateFormat)
                : ""
            }
            sx={cursorTextDefault}
            InputLabelProps={
              defaultValues.creationDate ? { shrink: true } : { shrink: false }
            }
          />
          <RHFTextField
            name="modifiedBy"
            label="Modified By"
            inputProps={{ readOnly: true }}
            focused
            sx={cursorTextDefault}
            InputLabelProps={
              defaultValues.modifiedBy ? { shrink: true } : { shrink: false }
            }
          />
          <RHFTextField
            name="modifiedDate"
            label="Modified Date"
            inputProps={{ readOnly: true }}
            focused
            value={
              defaultValues.modifiedDate &&
              isValid(new Date(defaultValues.modifiedDate))
                ? format(new Date(defaultValues.modifiedDate), dateFormat)
                : ""
            }
            sx={cursorTextDefault}
            InputLabelProps={
              defaultValues.modifiedDate ? { shrink: true } : { shrink: false }
            }
          />
        </Box>
      </Grid>
    </FormProvider>
  );
}
