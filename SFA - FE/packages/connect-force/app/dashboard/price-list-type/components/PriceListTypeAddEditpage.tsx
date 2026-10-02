import FormProvider, { RHFAutocompleteField, RHFTextField } from "@/components/hook-form";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setPriceListTypeError,
  setPriceListTypeMessage,
} from "@/redux/slices/price-list-type-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  createPriceListType,
  updatePriceListType,
} from "@/service/mapping-service/priceListType.service";
import { getAllPriceTypeDetails } from "@/service/priceType.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  FormValuesPropsPriceListType,
  PriceListType,
} from "@/types/price-list-types";
import { priceListTypeValidationSchema } from "@/utils/schemas/priceListTypeValidationSchema";
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
  currentPriceListType?: PriceListType | undefined;
  isEdit?: boolean;
};

export default function PriceListTypeForm({
  currentPriceListType,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { priceTypeDetails: priceTypes } = useSelector(
    (state) => state.priceTypeSlice
  );

  const responseMessage = useSelector(
    (state) => state.priceListTypeSlice.message
  );

  const responseError = useSelector((state) => state.priceListTypeSlice.error);

  const defaultValues = useMemo(
    () => ({
      priceListTypeId: currentPriceListType?.priceListTypeId || "",
      priceListTypeName: currentPriceListType?.priceListTypeName || "",
      priceListTypeDescription:
        currentPriceListType?.priceListTypeDescription || "",
      priceTypeUId: currentPriceListType?.priceTypeUId || null,
    }),
    [currentPriceListType]
  );

  const methods = useForm<FormValuesPropsPriceListType>({
    //@ts-ignore
    resolver: yupResolver(priceListTypeValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, setValue, control, watch } = methods;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllPriceTypeDetails(
            undefined,
            undefined,
            undefined,
            "name",
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
    if (isEdit && currentPriceListType) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentPriceListType]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setPriceListTypeMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setPriceListTypeError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  const handleCreatePriceListType = async (
    data: FormValuesPropsPriceListType
  ) => {
    try {
      await createPriceListType(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.priceListType.list);
    } catch (error: any) {}
  };

  const mapListToOptions = (list: any[], labelKey: string, valueKey: string) =>
    list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  const priceTypesMap = mapListToOptions(
    priceTypes,
    "name",
    "uId"
  );

  const handleUpdatePriceListType = async (
    data: FormValuesPropsPriceListType
  ) => {
    try {
      await updatePriceListType(currentPriceListType?.uId, data);
      router.push(PATH_DASHBOARD.priceListType.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.priceListType.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreatePriceListType)
          : handleSubmit(handleUpdatePriceListType)
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
            aria-controls="Price List Type Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Price List Type Details
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
            <RHFTextField name="priceListTypeId" label="Code*" />
            <RHFTextField name="priceListTypeName" label="Name*" />
            <RHFAutocompleteField
              name="priceTypeUId"
              placeholder="Price Type*"
              options={priceTypesMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <RHFTextField name="priceListTypeDescription" label="Description" />
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
