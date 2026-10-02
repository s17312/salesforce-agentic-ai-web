import StatusChip from "@/components/color-chip/Chip";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFTextField from "@/components/hook-form/RHFTextField";
import {
  cursorTextDefault,
  scrollBarDefault
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { PaymentModeDTO } from "connect-force-api-client";
import {
  FormValuesPropPaymentMode as FormValuesProps
} from "connect-force-api-client/models/payment-mode";
import { format, isValid } from "date-fns";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  currentPaymentMode?: PaymentModeDTO | undefined;
};

export default function PaymentModeView({ currentPaymentMode }: Props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";

  const defaultValues = useMemo(
    () => ({
      paymentModeId: currentPaymentMode?.paymentModeId || "",
      paymentModeType: currentPaymentMode?.paymentModeType || "",
      description: currentPaymentMode?.description || "",
      createdDate: currentPaymentMode?.creationDate || null,
      active: currentPaymentMode?.active == true ? "Active" : "Inactive",
      modifiedBy: currentPaymentMode?.modifiedBy || "ADMIN",
      modifiedDate: currentPaymentMode?.modifiedDate || null,
      createdBy: currentPaymentMode?.createdBy || "ADMIN",
    }),
    [currentPaymentMode]
  );

  useEffect(() => {
    reset(defaultValues);
  }, [currentPaymentMode]);

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const { reset } = methods;

  return (
    <FormProvider methods={methods}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <StatusChip status={currentPaymentMode?.active} />
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
            aria-controls="Payment Mode Creation"
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
              Payment Mode Details
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
              name="paymentModeId"
              label="Code"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="paymentModeType"
              label="Type"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="description"
              label="Description"
              multiline
              maxRows={3}
              placeholder="Description"
              inputProps={{ readOnly: true }}
              focused
              sx={{
                ...scrollBarDefault,
              }}
              InputLabelProps={
                defaultValues.description ? { shrink: true } : { shrink: false }
              }
            />
          </Box>
        </Accordion>
        {/* </Card> */}
      </Grid>
      <Grid item xs={12} sx={{ mb: 3 }}>
        <Box
          sx={{ mx: 12, mb: 3 }}
          rowGap={3}
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
          />
          <RHFTextField
            name="createdDate"
            label="Created Date"
            inputProps={{ readOnly: true }}
            focused
            value={
              defaultValues.createdDate &&
              isValid(new Date(defaultValues.createdDate))
                ? format(new Date(defaultValues.createdDate), dateFormat)
                : ""
            }
            sx={cursorTextDefault}
          />
          <RHFTextField
            name="modifiedBy"
            label="Modified By"
            inputProps={{ readOnly: true }}
            focused
            sx={cursorTextDefault}
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
