import StatusChip from "@/components/color-chip/Chip";
import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import { useSelector } from "@/redux/store";
import { getPriceListAllByPriceType } from "@/service/mapping-service/priceListType.service";
import {
  cursorTextDefault,
  scrollBarDefault,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { Company } from "@/types/company-types";
import { mapListToOptions } from "@/utils/sortUtils";
import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { format, isValid } from "date-fns";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  currentCompany?: Company | undefined;
};

type FormValuesProps = {
  companyId?: string | null;
  companyName?: string | null;
  legalEntryTypeUId?: number | string | null;
  registeredAddress?: string | null;
  phoneNo?: string | null;
  email?: string | null;
  taxID?: string | null;
  companySize?: string | null;
  industry?: string | null;
  siCcode?: string | null;
  comments?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  vatNo?: string | null;
  phoneNoCountryCode?: string | null;
  priceListAssignmentUIds?: number[] | null;
  priceListAssignmentDefaultUId?: number | null | undefined;
};

export default function CompanyView({ currentCompany }: Props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
  const priceListTypeList = useSelector(
    (state) => state.priceListTypeSlice.priceListTypeDetails
  );

  const defaultValues = useMemo(
    () => ({
      companyId: currentCompany?.companyId || "",
      companyName: currentCompany?.companyName || "",
      legalEntryTypeUId: currentCompany?.legalEntryTypeUId || "",
      legalEntryType: currentCompany?.legalEntryType?.legalEntryTypeName || "",
      phoneNo: currentCompany?.phoneNo || "",
      email: currentCompany?.email || "",
      taxID: currentCompany?.taxID || "",
      companySize: currentCompany?.companySize || "",
      industry: currentCompany?.industry || "",
      siCcode: currentCompany?.siCcode || "",
      comments: currentCompany?.comments || "",
      address: [
        currentCompany?.registeredAddress,
        currentCompany?.addressLine1,
        currentCompany?.addressLine2,
      ]
        .filter(Boolean)
        .join(", "),
      vatNo: currentCompany?.vatNo || "",
      phoneNoCountryCode: currentCompany?.phoneNoCountryCode || "",
      createdBy: currentCompany?.createdBy || "ADMIN",
      modifiedBy: currentCompany?.modifiedBy || "ADMIN",
      creationDate: currentCompany?.creationDate || "",
      modifiedDate: currentCompany?.modifiedDate || "",
      priceListAssignmentUIds: currentCompany?.priceListType?.map(
        (item: any) => item.uId
      ),
      priceListTypeDefault:
        currentCompany?.priceListTypeDefault?.priceListTypeName || null,
    }),
    [currentCompany]
  );

  useEffect(() => {
    reset(defaultValues);
  }, [currentCompany]);

  const fetchPriceListsData = async () => {
    try {
      await getPriceListAllByPriceType(1);
    } catch (error) {
      console.error("Error in getting price list data", error);
    }
  };

  useEffect(() => {
    fetchPriceListsData();
  }, []);

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const { reset, control, watch } = methods;

  const priceListTypeMap = mapListToOptions(
    priceListTypeList,
    "priceListTypeName",
    "uId"
  );

  const selectedPriceListTypesIDs = watch("priceListAssignmentUIds");

  const selectedPriceListTypes = selectedPriceListTypesIDs?.map(
    (priceListId: number) => {
      const priceListType = priceListTypeList.find(
        (pl) => pl.uId === priceListId
      );

      return {
        value: priceListId,
        priceListTypeName: priceListType?.priceListTypeName,
      };
    }
  );

  return (
    <FormProvider methods={methods}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <StatusChip status={currentCompany?.active} />
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
            aria-controls="Company Creation"
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
              sx={{ ml: 6, mb: 2, fontWeight: 500 }}
            >
              Company Details
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
              name="companyId"
              label="Code"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="companyName"
              label="Name"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="legalEntryType"
              label="Legal Entity Type"
              focused
              inputProps={{ readOnly: true }}
            />
            <RHFTextField
              name="taxID"
              label="Tax ID"
              focused
              sx={cursorTextDefault}
              inputProps={{ readOnly: true }}
              InputLabelProps={
                defaultValues.taxID ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="companySize"
              label="Company Size"
              focused
              sx={cursorTextDefault}
              inputProps={{ readOnly: true }}
              InputLabelProps={
                defaultValues.companySize ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="industry"
              label="Industry"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.industry ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="siCcode"
              label="SIC Code"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.siCcode ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="vatNo"
              label="VAT Number"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
          </Box>
        </Accordion>

        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="Distributor Creation"
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
              sx={{ ml: 6, mb: 2, fontWeight: 500 }}
            >
              Contact Details
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
              name="address"
              label="Address"
              focused
              inputProps={{ readOnly: true }}
              multiline
              maxRows={3}
              sx={{
                ...scrollBarDefault,
              }}
            />
            <RHFTextField
              name="phoneNo"
              label="Phone"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="email"
              label="Email"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="comments"
              label="Comments"
              focused
              inputProps={{ readOnly: true }}
              multiline
              maxRows={3}
              sx={{
                ...scrollBarDefault,
              }}
              InputLabelProps={
                defaultValues.comments ? { shrink: true } : { shrink: false }
              }
            />
          </Box>
        </Accordion>

        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="Distributor Creation"
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
              sx={{ ml: 6, mb: 2, fontWeight: 500 }}
            >
              Price List Assignment
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
            <Box>
              <RHFAutocompleteCheckboxField
                name="priceListAssignmentUIds"
                placeholder="Price Lists"
                options={priceListTypeMap}
                control={control}
                rules={{ required: true }}
                disabled={true}
              />
            </Box>
            <Box>
              {selectedPriceListTypes && selectedPriceListTypes.length > 0 && (
                <Box sx={{ mx: 12, mb: 3 }}>
                  <RHFTextField
                    name="priceListTypeDefault"
                    label="Default Price List"
                    focused
                    inputProps={{ readOnly: true }}
                    sx={cursorTextDefault}
                  />
                </Box>
              )}
            </Box>
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
