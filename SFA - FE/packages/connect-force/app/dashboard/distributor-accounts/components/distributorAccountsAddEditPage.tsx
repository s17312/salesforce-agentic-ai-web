import FormProvider, { RHFTextField } from "@/components/hook-form";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setDistributorAccountsError,
  setDistributorAccountsMessage,
} from "@/redux/slices/distributor-accounts-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  createDistributorAccount,
  updateDistributorAccount,
} from "@/service/distributor-accounts-service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  DistributorAccounts,
  FormValuesPropsDistributorAccounts,
} from "@/types/distributor-accounts-type";
import { distributorAccountsValidationSchema } from "@/utils/schemas/distributorAccountsSchema";
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
  currentDistributorAccount?: DistributorAccounts | undefined;
  isEdit?: boolean;
};

export default function DistributorAccountsForm({
  currentDistributorAccount,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      accountId: currentDistributorAccount?.accountId || "",
      accountName: currentDistributorAccount?.accountName || "",
      accountNumber: currentDistributorAccount?.accountNumber || "",
      description: currentDistributorAccount?.description || "",
    }),
    [currentDistributorAccount]
  );

  const responseMessage = useSelector(
    (state) => state.distributorAccountsSlice.message
  );

  const responseError = useSelector(
    (state) => state.distributorAccountsSlice.error
  );

  useEffect(() => {
    if (isEdit && currentDistributorAccount) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentDistributorAccount]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setDistributorAccountsMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setDistributorAccountsError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesPropsDistributorAccounts>({
    //@ts-ignore
    resolver: yupResolver(distributorAccountsValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState } = methods;

  const handleCreateDistributorAccount = async (
    data: FormValuesPropsDistributorAccounts
  ) => {
    try {
      await createDistributorAccount(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.distributorAccounts.list);
    } catch (error: any) {}
  };

  const handleUpdateDistributorAccount = async (
    data: FormValuesPropsDistributorAccounts
  ) => {
    try {
      await updateDistributorAccount(currentDistributorAccount?.uId, data);
      router.push(PATH_DASHBOARD.distributorAccounts.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.distributorAccounts.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateDistributorAccount)
          : handleSubmit(handleUpdateDistributorAccount)
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
            aria-controls="Distributor Accounts Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Distributor Account Details
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
            <RHFTextField name="accountId" label="Code*" />
            <RHFTextField name="accountName" label="Name*" />
            <RHFTextField
              name="accountNumber"
              label="Account No*"
              type="number"
              onKeyDown={(e) => {
                if (
                  e.key === "-" ||
                  e.key === "+" ||
                  e.key === "e" ||
                  e.key === "," ||
                  e.key === "."
                ) {
                  e.preventDefault();
                }
              }}
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
            />
            <RHFTextField name="description" label="Description" />
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
