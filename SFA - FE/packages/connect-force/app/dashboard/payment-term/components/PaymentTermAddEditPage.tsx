"use client";

import { PaymentTerm } from "@/types/payment-term";

import { useSnackbar } from "notistack";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { paymentTermValidationSchema } from "@/utils/schemas/paymentTermSchema";
import {
  createPaymentTerm,
  updatePaymentTerm,
} from "@/service/paymentTerm.service";
import { PATH_DASHBOARD } from "@/routes/paths";
import FormProvider from "@/components/hook-form/FormProvider";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { RHFTextField } from "@/components/hook-form";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";
import { SaveIcon } from "@/components/icons/saveIcon";
import { useSelector } from "@/redux/store";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";

type props = {
  currentPaymentTerm?: PaymentTerm | undefined;
  isEdit?: boolean;
};

export type FormValuesProps = {
  code?: string | null;
  name?: string | null;
  description?: string | null;
};

export default function PaymentTermAddEditForm({
  currentPaymentTerm,
  isEdit = false,
}: props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      code: currentPaymentTerm?.code || "",
      name: currentPaymentTerm?.name || "",
      description: currentPaymentTerm?.description || "",
    }),
    [currentPaymentTerm]
  );

  useEffect(() => {
    if (isEdit && currentPaymentTerm) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, []);

  const methods = useForm<FormValuesProps>({
    //@ts-ignore
    resolver: yupResolver(paymentTermValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, setValue, setFocus } = methods;

  const onError = (errors: any) => {
    const firstErrorField: any = Object.keys(errors)[0];
    setFocus(firstErrorField);
  };

  const handleCreatePaymentTerm = async (data: FormValuesProps) => {
    await createPaymentTerm(data);
    enqueueSnackbar("Payment Term successfully registered", {
      variant: "success",
    });
    reset(defaultValues);
    router.push(PATH_DASHBOARD.paymentTerm.list);
  };

  const handleUpdatePaymentTerm = async (data: FormValuesProps) => {
    await updatePaymentTerm(currentPaymentTerm?.uId, data);
    enqueueSnackbar("Payment Term successfully updated", {
      variant: "success",
    });
    router.push(PATH_DASHBOARD.paymentTerm.list);
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.paymentTerm.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreatePaymentTerm, onError)
          : handleSubmit(handleUpdatePaymentTerm, onError)
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
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 3, fontWeight: 500 }}>
              Payment Term Details
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
            <RHFTextField name="code" label="Code*" />
            <RHFTextField name="name" label="Name*" />
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
