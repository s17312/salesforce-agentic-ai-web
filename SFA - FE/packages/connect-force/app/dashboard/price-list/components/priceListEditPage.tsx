import { RHFAutocompleteField, RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { SaveIcon } from "@/components/icons/saveIcon";
import { setAllPriceListTypeDetails } from "@/redux/slices/price-list-type-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllCompany } from "@/service/company.service";
import { getAllPriceListTypeDetails } from "@/service/mapping-service/priceListType.service";
import {
  getProductAllByCompanyId,
  updatePriceList,
} from "@/service/priceList.service";
import { getAllPriceTypeDetails } from "@/service/priceType.service";
import { getAllActiveProducts } from "@/service/product.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { formatRate } from "@/utils/formatCurrency";
import { priceListValidationSchema } from "@/utils/schemas/priceListSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

type PriceList = {
  uId?: number;
  priceListTypeUId?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  priceTypeUId?: number | null;
  companyUId?: number | null;
  productUId?: number | null;
  rate?: number | null;
  mrp?: number | null;
  batchNumber?: string | null;
};

type Props = {
  currentPriceList?: PriceList | undefined;
};

export default function PriceListEditForm({ currentPriceList }: Props) {
  const router = useRouter();
  const { priceTypeDetails: priceTypes } = useSelector(
    (state) => state.priceTypeSlice
  );
  const companyList = useSelector((state) => state.companySlice.companies);
  const priceListTypeList = useSelector(
    (state) => state.priceListTypeSlice.priceListTypeDetails
  );
  const [filteredProducts, setFilteredProducts] = useState([]);

  const defaultValues = useMemo(
    () => ({
      priceListTypeUId: currentPriceList?.priceListTypeUId || 0,
      startDate: currentPriceList?.startDate || "",
      endDate: currentPriceList?.endDate || "",
      priceTypeUId: currentPriceList?.priceTypeUId || null,
      companyUId: currentPriceList?.companyUId || 0,
      productUId: currentPriceList?.productUId || 0,
      rate: currentPriceList?.rate || null,
      mrp: currentPriceList?.mrp || null,
      batchNumber: currentPriceList?.batchNumber || "",
    }),
    [currentPriceList]
  );
  const [formattedRate, setFormattedRate] = useState<string>(
    formatRate(defaultValues.rate)
  );

  const methods = useForm<PriceList>({
    //@ts-ignore
    resolver: yupResolver(priceListValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, control, setValue, reset, formState, setFocus } =
    methods;

  const onError = useCallback(
    (errors: any) => {
      const firstErrorField: any = Object.keys(errors)[0];
      setFocus(firstErrorField);
    },
    [setFocus]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllPriceTypeDetails(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            true
          ),
          getAllCompany(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            true
          ),
          getAllActiveProducts(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            true
          ),
          getAllPriceListTypeDetails(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            true
          ),
        ]);
      } catch (error) {
        enqueueSnackbar(`Error in getting data! `, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [currentPriceList]);

  const mapListToOptions = useCallback(
    (list: any[], labelKey: string, valueKey: string) =>
      list.map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
      })),
    []
  );

  const priceTypesMap = useMemo(
    () => mapListToOptions(priceTypes, "name", "uId"),
    [priceTypes, mapListToOptions]
  );
  const companiesMap = useMemo(
    () => mapListToOptions(companyList, "companyName", "uId"),
    [companyList, mapListToOptions]
  );
  const productsMap = useMemo(
    () => mapListToOptions(filteredProducts, "productName", "uId"),
    [filteredProducts, mapListToOptions]
  );
  const priceListTypeMap = useMemo(
    () => mapListToOptions(priceListTypeList, "priceListTypeName", "uId"),
    [priceListTypeList, mapListToOptions]
  );

  const handleCancel = useCallback(() => {
    router.push(PATH_DASHBOARD.priceList.list);
  }, [router]);

  const handleUpdatePriceList = useCallback(
    async (data: PriceList) => {
      try {
        if (currentPriceList?.uId !== undefined) {
          const formattedData = {
            ...data,
            startDate: data.startDate
              ? format(new Date(data.startDate), "yyyy-MM-dd'T'HH:mm:ss")
              : null,
            endDate: data.endDate
              ? format(new Date(data.endDate), "yyyy-MM-dd'T'HH:mm:ss")
              : null,
          };
          await updatePriceList(currentPriceList.uId, formattedData);
          enqueueSnackbar("Price List successfully updated", {
            variant: "success",
          });
        }
        router.push(PATH_DASHBOARD.priceList.list);
        dispatch(setAllPriceListTypeDetails([]));
      } catch (error: any) {
        console.error("Error updating price list:", error);
        enqueueSnackbar("Failed to update Price List", { variant: "error" });
      }
    },
    [currentPriceList, router]
  );

  // Watch for changes in priceListTypeUId
  const selectedPriceListTypeUId = useWatch({
    control,
    name: "priceListTypeUId",
  });

  // Watch for changes in companyUId
  const selectedCompanyUId = useWatch({
    control,
    name: "companyUId",
  });

  useEffect(() => {
    if (selectedPriceListTypeUId) {
      const foundObject = priceListTypeList.find(
        (pt) => pt.uId === selectedPriceListTypeUId
      );
      const foundPLId = foundObject?.priceType?.priceTypeID;
      const foundPriceTypeObject = priceTypes.find(
        (pt) => pt.priceTypeID === foundPLId
      );

      if (foundPriceTypeObject) {
        setValue("priceTypeUId", foundPriceTypeObject.uId);
      }
    }
  }, [selectedPriceListTypeUId, priceTypes, setValue]);

  useEffect(() => {
    const fetchProductsByCompanyId = async () => {
      if (selectedCompanyUId) {
        try {
          const products = await getProductAllByCompanyId(selectedCompanyUId);
          setFilteredProducts(products);
        } catch (error) {
          enqueueSnackbar(
            `Error in getting products for the selected company!`,
            { variant: "error" }
          );
        }
      } else {
        setFilteredProducts([]);
      }
    };

    fetchProductsByCompanyId();
  }, [selectedCompanyUId]);

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit(handleUpdatePriceList, onError)}
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
              Price List Details
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
            <RHFDatePicker
              name="startDate"
              label="Start Date*"
              disableFuture={false}
              onChange={(date: any) => {
                setValue("startDate", date);
              }}
              value={
                defaultValues.startDate
                  ? new Date(defaultValues.startDate)
                  : null
              }
              renderInput={(params) => <TextField {...params} />}
            />
            <RHFDatePicker
              name="endDate"
              label="End Date*"
              disableFuture={false}
              onChange={(date: any) => {
                setValue("endDate", date);
              }}
              value={
                defaultValues.endDate ? new Date(defaultValues.endDate) : null
              }
              renderInput={(params) => <TextField {...params} />}
            />
            <RHFAutocompleteField
              name="priceListTypeUId"
              placeholder="Price List Type*"
              options={priceListTypeMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
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
              disabled
            />
            <RHFAutocompleteField
              name="companyUId"
              placeholder="Company*"
              options={companiesMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <RHFAutocompleteField
              name="productUId"
              placeholder="Product*"
              options={productsMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <RHFTextField
              name="rate"
              label="Rate*"
              type="text"
              value={formattedRate}
              inputProps={{ inputMode: "decimal" }}
              onBlur={(e) => {
                const raw = e.target.value.replace(/,/g, "");
                const number = parseFloat(raw);
                if (!isNaN(number)) {
                  setValue("rate", number, { shouldDirty: true });
                  setFormattedRate(formatRate(number));
                } else {
                  setValue("rate", null, { shouldDirty: true });
                  setFormattedRate("0");
                }
              }}
              onChange={(e) => {
                const input = e.target.value;
                const raw = input.replace(/,/g, "");
                const number = parseFloat(raw);
                setFormattedRate(input);
                setValue("rate", isNaN(number) ? null : number, {
                  shouldDirty: true,
                });
              }}
            />

            <RHFTextField
              name="mrp"
              label="MRP*"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
            />
            <RHFTextField name="batchNumber" label="Batch Number*" />
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
              Update
            </LoadingButton>

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
          </Box>
        </Box>
      </Grid>
    </FormProvider>
  );
}
