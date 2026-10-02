import FormProvider from "@/components/hook-form/FormProvider";
import { PATH_DASHBOARD } from "@/routes/paths";
import { yupResolver } from "@hookform/resolvers/yup";
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
import RHFTextField from "@/components/hook-form/RHFTextField";
import { LoadingButton } from "@mui/lab";
import { SaveIcon } from "@/components/icons/saveIcon";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dispatch, useSelector } from "@/redux/store";
import { LegalEntryType } from "connect-force-api-client/models/legal-entry-type";
import {
  setLegleEntityTypeError,
  setLegleEntityTypeMessage,
} from "@/redux/slices/legle-entity-type-slice";
import { legalEntityTypeValidationSchema } from "@/utils/schemas/legalEntityTypeSchema";
import {
  createLegleEntityType,
  updateLegleEntityType,
} from "@/service/legleEntityType.service";

type Props = {
  currentLegalEntityType?: LegalEntryType | undefined;
  isEdit?: boolean;
};

type FormValuesProps = {
  legalEntryTypeId?: string;
  legalEntryTypeName?: string;
  description?: string;
};

export default function LegaleEntityTypeAddForm({
  currentLegalEntityType,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      legalEntryTypeId: currentLegalEntityType?.legalEntryTypeId || "",
      legalEntryTypeName: currentLegalEntityType?.legalEntryTypeName || "",
      description: currentLegalEntityType?.description || "",
    }),
    [currentLegalEntityType]
  );

  const responseMessage = useSelector(
    (state) => state.legleEntityTypeSlice.message
  );

  const responseError = useSelector(
    (state) => state.legleEntityTypeSlice.error
  );

  useEffect(() => {
    if (isEdit && currentLegalEntityType) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentLegalEntityType]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setLegleEntityTypeMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setLegleEntityTypeError(null));
    }
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesProps>({
    //@ts-ignore
    resolver: yupResolver(legalEntityTypeValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState } = methods;

  const handleCreateLegalEntryType = async (data: FormValuesProps) => {
    try {
      await createLegleEntityType(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.legleEntityType.list);
    } catch (error: any) {}
  };

  const handleUpdateLegalEntryType = async (data: FormValuesProps) => {
    try {
      await updateLegleEntityType(currentLegalEntityType?.uId, data);
      router.push(PATH_DASHBOARD.legleEntityType.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.legleEntityType.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateLegalEntryType)
          : handleSubmit(handleUpdateLegalEntryType)
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
            aria-controls="Legal Entity Type Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Legal Entity Type Details
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
            <RHFTextField name="legalEntryTypeId" label="Code*" />
            <RHFTextField name="legalEntryTypeName" label="Name*" />
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
