import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setLostCallError,
  setLostCallMessage,
} from "@/redux/slices/tour/lost-call/lost-call-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllLostCallReasons } from "@/service/lostCallReason.service";
import {
  createLostCall,
  updateLostCall,
} from "@/service/tour-service/lostCall.service";
import {
  cursorDefault,
  cursorTextDefault,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { FormValuesPropsLostCall } from "@/types/lost-call-types";
import { lostCallValidationSchema } from "@/utils/schemas/tour/lostCallSchema";
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
import { format, isValid } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  currentLostCall?: any;
  isEdit?: boolean;
  schedule?: any;
};

export default function LostCallAddForm({
  currentLostCall,
  isEdit = false,
  schedule,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const lostCallReasonList = useSelector(
    (state) => state.lostCallReasonSlice.lostCallReasonDetails
  );
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
  const defaultValues = useMemo(
    () => ({
      lostCallReasonUId: currentLostCall?.lostCallReasonUId || null,
      tourScheduleUId: currentLostCall?.tourSchedule?.tourID || null,
      lostCallDate: currentLostCall?.salesDate || null,
      repUId: currentLostCall?.representative?.name || null,
      routeUId: currentLostCall?.route?.routeName || null,
      outletUId: currentLostCall?.outlet?.outletID || null,
      outletName: currentLostCall?.outlet?.name || null,
      distributorUId: schedule?.distributor?.distributorName || null,
    }),
    [currentLostCall, schedule]
  );

  const responseMessage = useSelector((state) => state.lostCallSlice.message);

  const responseError = useSelector((state) => state.lostCallSlice.error);

  const lostCallReasonsMap = lostCallReasonList
    ? mapListToOptions(lostCallReasonList, "reason", "uId")
    : [];

  const searchParams = useSearchParams();
  const saleViewUId = Number(searchParams.get("saleViewUId"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllLostCallReasons(
            undefined,
            undefined,
            undefined,
            "reason",
            "asc",
            true
          ),
        ]);
      } catch (error) {
        enqueueSnackbar(`Error in getting data`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isEdit && currentLostCall) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentLostCall]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setLostCallMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setLostCallError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesPropsLostCall>({
    //@ts-ignore
    resolver: yupResolver(lostCallValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, control } = methods;

  const handleCreateLostCall = async (data: FormValuesPropsLostCall) => {
    try {
      const formatData = {
        tourScheduleUId: currentLostCall?.tourScheduleUId,
        lostCallDate: currentLostCall?.salesDate,
        repUId: currentLostCall?.repUId,
        routeUId: currentLostCall?.routeUId,
        outletUId: currentLostCall?.outletUId,
        lostCallReasonUId: data?.lostCallReasonUId,
        distributorUId: schedule?.distributor?.uId,
        salesViewUId: saleViewUId,
      };
      await createLostCall(formatData);
      reset(defaultValues);
      router.push(`${PATH_DASHBOARD.repTour.repTour}/${schedule.uId}`);
    } catch (error: any) {}
  };

  const handleUpdateLostCall = async (data: FormValuesPropsLostCall) => {
    try {
      await updateLostCall(currentLostCall?.uId, data);

      router.push(PATH_DASHBOARD.repTour.repTour);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.repTour.repTour);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateLostCall)
          : handleSubmit(handleUpdateLostCall)
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
            aria-controls="Lost Call Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Lost Call Details
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
            <RHFTextField
              name="tourScheduleUId"
              label="Tour ID"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.tourScheduleUId
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="lostCallDate"
              label="Date"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              value={
                defaultValues.lostCallDate &&
                isValid(new Date(defaultValues.lostCallDate))
                  ? format(new Date(defaultValues.lostCallDate), dateFormat)
                  : ""
              }
              InputLabelProps={
                defaultValues.lostCallDate
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="distributorUId"
              label="Distributor"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.distributorUId
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="repUId"
              label="Sales Rep"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.repUId ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="routeUId"
              label="Route"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.routeUId ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="outletName"
              label="Outlet Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.outletName ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="outletUId"
              label="Outlet ID"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.outletUId ? { shrink: true } : { shrink: false }
              }
            />
            <RHFAutocompleteField
              name="lostCallReasonUId"
              placeholder="Lost Call Reason*"
              options={lostCallReasonsMap}
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
