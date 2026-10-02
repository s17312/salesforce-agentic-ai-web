import FormProvider, {
  RHFCheckbox,
  RHFTextField,
} from "@/components/hook-form";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  createReturnReason,
  updateReturnReason,
} from "@/service/returnReason.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  FormValuesPropsReturnReason,  
} from "@/types/return-reason-types";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { SaveIcon } from "@/components/icons/saveIcon";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { returnReasonValidationSchema } from "@/utils/schemas/returnReasonSchema";
import { dispatch, useSelector } from "@/redux/store";
import { enqueueSnackbar } from "notistack";
import {
  setReturnReasonError,
  setReturnReasonMessage,
} from "@/redux/slices/return-reason-slice";

type Props = {
  currentReturnReason?: FormValuesPropsReturnReason | undefined;
  isEdit?: boolean;
};

export default function ReturnReasonForm({
  currentReturnReason,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const defaultValues = useMemo(() => {
    return {
      reasonId: currentReturnReason?.reasonId || "",
      name: currentReturnReason?.name || "",
      description: currentReturnReason?.description || "",
      eligible: currentReturnReason?.eligible || false,
    };
  }, [currentReturnReason]);

  const responseMessage = useSelector(
    (state) => state.returnReasonSlice.message
  );
  const responseError = useSelector((state) => state.returnReasonSlice.error);

  useEffect(() => {
    if (isEdit && currentReturnReason) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentReturnReason]);

  useEffect(() => {
    reset({ reasonId: "", name: "", description: "", eligible: false });
    setTimeout(() => reset(defaultValues), 0);
  }, []);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setReturnReasonMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setReturnReasonError(null));
    }
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesPropsReturnReason>({
    //@ts-ignore
    resolver: yupResolver(returnReasonValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, watch } = methods;

  const handleCreateReturnReason = async (
    data: FormValuesPropsReturnReason
  ) => {
    try {
      await createReturnReason(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.returnReason.list);
    } catch (error: any) {}
  };

  const handleUpdateReturnReason = async (
    data: FormValuesPropsReturnReason
  ) => {
    try {
      await updateReturnReason(currentReturnReason?.uId, data);
      router.push(PATH_DASHBOARD.returnReason.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.returnReason.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateReturnReason)
          : handleSubmit(handleUpdateReturnReason)
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
            aria-controls="Return Reason Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Return Reason Details
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
            <RHFTextField name="reasonId" label="Code*" />
            <RHFTextField name="name" label="Name*" />
            <RHFTextField name="description" label="Description" />
            <Box>
              <RHFCheckbox name="eligible" label="Salable" />
            </Box>
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
