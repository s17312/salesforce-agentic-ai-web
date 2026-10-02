import StatusChip from "@/components/color-chip/Chip";
import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import {
  cursorTextDefault,
  scrollBarDefault,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { Distributor } from "@/types/distributor-types";
import { mapListToOptions } from "@/utils/sortUtils";
import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { FormValuesProps } from "connect-force-api-client/models/distributor";
import { format, isValid } from "date-fns";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "@/redux/store";
import { getPriceListAllByPriceType } from "@/service/mapping-service/priceListType.service";
import { getAllDistributorAccounts } from "@/service/distributor-accounts-service";

type Props = {
  currentDistributor?: Distributor | undefined;
};

export default function DistributorView({ currentDistributor }: Props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
  const priceListTypeList = useSelector(
    (state) => state.priceListTypeSlice.priceListTypeDetails
  );
  const distributorAccountsList = useSelector(
    (state) => state.distributorAccountsSlice.distributorAccountsDetails
  );

  const defaultValues = useMemo(
    () => ({
      distributorID: currentDistributor?.distributorID || "",
      distributorName: currentDistributor?.distributorName || "",
      address: [
        currentDistributor?.address,
        currentDistributor?.addressLine1,
        currentDistributor?.addressLine2,
      ]
        .filter(Boolean)
        .join(", "),
      provinceUId: currentDistributor?.provinceUId || "",
      province: currentDistributor?.province?.nameEN || "",
      districtUId: currentDistributor?.districtUId || "",
      district: currentDistributor?.district?.name_en || "",
      townUId: currentDistributor?.townUId || "",
      city: currentDistributor?.city?.name_en || "",
      title: currentDistributor?.title?.description || "",
      phone: currentDistributor?.phone || "",
      titleUId: currentDistributor?.titleUId || "",
      ownerName:
        `${currentDistributor?.title?.description} ${currentDistributor?.ownerName}` ||
        "",
      ownerAddr: [
        currentDistributor?.ownerAddr,
        currentDistributor?.ownerAddressLine1,
        currentDistributor?.ownerAddressLine2,
      ]
        .filter(Boolean)
        .join(", "),
      ownerTpNo: currentDistributor?.ownerTpNo || "",
      mobileNo: currentDistributor?.mobileNo || "",
      appointedDate: currentDistributor?.appointedDate || null,
      businessCategoryUId: currentDistributor?.businessCategoryUId || "",
      businessCategory: currentDistributor?.businessCategory?.category || "",
      paymentTermUId: currentDistributor?.paymentTermUId || "",
      paymentTerm: currentDistributor?.paymentTerm?.name || "",
      vatNo: currentDistributor?.vatNo || "",
      createdBy: currentDistributor?.createdBy || "ADMIN",
      creationDate: currentDistributor?.creationDate || "",
      modifiedBy: currentDistributor?.modifiedBy || "ADMIN",
      modifiedDate: currentDistributor?.modifiedDate || "",
      priceListAssignmentUIds: currentDistributor?.priceListType?.map(
        (item: any) => item.uId
      ),
      priceListTypeDefault:
        currentDistributor?.priceListTypeDefault?.priceListTypeName || null,
      cashAccountAssignmentUIds: currentDistributor?.cashAccount?.map(
        (item: any) => item.uId
      ),
      cashAccountAssignmentDefault:
        currentDistributor?.cashAccountDefault?.accountName || null,
      chequeAccountAssignmentUIds: currentDistributor?.chequeAccount?.map(
        (item: any) => item.uId
      ),
      chequeAccountAssignmentDefault:
        currentDistributor?.chequeAccountDefault?.accountName || null,
      outstandingAccountAssignmentUIds:
        currentDistributor?.outstandingAccount?.map((item: any) => item.uId),
      outstandingAccountAssignmentDefault:
        currentDistributor?.outstandingAccountDefault?.accountName || null,
    }),
    [currentDistributor]
  );

  const fetchPriceListsData = async () => {
    try {
      await getPriceListAllByPriceType(2);
    } catch (error) {
      console.error("Error in getting price list data", error);
    }
  };

  const fetchDistributorAccountsData = async () => {
    try {
      await getAllDistributorAccounts(
        undefined,
        undefined,
        undefined,
        undefined,
        "asc",
        true
      );
    } catch (error) {
      console.error("Error in getting distributor accounts list data", error);
    }
  };

  useEffect(() => {
    // fetchData();
    fetchPriceListsData();
    fetchDistributorAccountsData();
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [currentDistributor]);

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const { reset, control, watch } = methods;

  const priceListTypeMap = mapListToOptions(
    priceListTypeList,
    "priceListTypeName",
    "uId"
  );
  const distributorAccountsListTypeMap = mapListToOptions(
    distributorAccountsList,
    "accountName",
    "uId"
  );

  const selectedPriceListTypesIDs = watch("priceListAssignmentUIds");
  const selectedCashAccountIDs = watch("cashAccountAssignmentUIds");
  const selectedChequeAccountsIDs = watch("chequeAccountAssignmentUIds");
  const selectedOutstandingAccountIDs = watch(
    "outstandingAccountAssignmentUIds"
  );

  const selectedPriceListTypes = selectedPriceListTypesIDs?.map(
    (priceTypeUId: number) => {
      const priceListType = priceListTypeList.find(
        (pl) => pl.uId === priceTypeUId
      );
      return {
        value: priceTypeUId,
        priceListTypeName: priceListType?.priceListTypeName,
      };
    }
  );

  const selectedCashAccounts = selectedCashAccountIDs?.map(
    (accountUid: number) => {
      const cashAccount = distributorAccountsList.find(
        (pl) => pl.uId === accountUid
      );
      return {
        value: accountUid,
        accountName: cashAccount?.accountName,
      };
    }
  );

  const selectedChequeAccounts = selectedChequeAccountsIDs?.map(
    (accountUid: number) => {
      const chequeAccount = distributorAccountsList.find(
        (pl) => pl.uId === accountUid
      );
      return {
        value: accountUid,
        accountName: chequeAccount?.accountName,
      };
    }
  );

  const selectedOutstandingAccounts = selectedOutstandingAccountIDs?.map(
    (accountUid: number) => {
      const outAccount = distributorAccountsList.find(
        (pl) => pl.uId === accountUid
      );
      return {
        value: accountUid,
        accountName: outAccount?.accountName,
      };
    }
  );

  return (
    <FormProvider methods={methods}>
      <Grid
        item
        xs={12}
        sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}
      >
        <StatusChip status={currentDistributor?.active} />
      </Grid>

      <Grid item xs={12} sx={{ mt: 2, mb: 5 }}>
        {/* Distributor details */}
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
              Distributor Details
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
              name="distributorID"
              label="Code"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="distributorName"
              label="Name"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="address"
              label="Address"
              focused
              multiline
              maxRows={2}
              inputProps={{ readOnly: true }}
              sx={{
                ...scrollBarDefault,
              }}
            />
            <RHFTextField
              name="province"
              label="Province"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="district"
              label="District"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="city"
              label="Town"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="phone"
              label="Phone"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="vatNo"
              label="VAT Number"
              focused
              inputProps={{ readOnly: true }}
              InputLabelProps={
                defaultValues.vatNo ? { shrink: true } : { shrink: false }
              }
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
          {/* owner details */}
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
              Owner Details
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
              name="ownerName"
              label="Owner Name"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="ownerAddr"
              label="Owner Address"
              focused
              multiline
              maxRows={2}
              inputProps={{ readOnly: true }}
              sx={{
                ...scrollBarDefault,
              }}
            />
            <RHFTextField
              name="ownerTpNo"
              label="Owner Telephone Number"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="mobileNo"
              label="Mobile Number"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
          </Box>
        </Accordion>

        {/* Other details */}
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
              Additional Details
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
              name="appointedDate"
              label="Appointed Date"
              focused
              value={
                defaultValues.appointedDate
                  ? format(new Date(defaultValues.appointedDate), "dd/MM/yyyy")
                  : ""
              }
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="businessCategory"
              label="Business Category"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="paymentTerm"
              label="Payment Term"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
          </Box>
        </Accordion>

        {/* Price List assignment */}
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="Price List assignment"
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
              Price List assignment
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
                    label="Default Price List Type"
                    focused
                    inputProps={{ readOnly: true }}
                    sx={cursorTextDefault}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Accordion>
        {/* Account assignment */}
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="Cash Account assignment"
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
              Account assignment
            </Typography>
          </AccordionSummary>
          <Typography variant="body2" sx={{ mx: 12, fontWeight: 600, mb: 3 }}>
            Cash Account Assignment
          </Typography>
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
                name="cashAccountAssignmentUIds"
                placeholder="Cash Accounts"
                options={distributorAccountsListTypeMap}
                control={control}
                rules={{ required: true }}
                disabled={true}
              />
            </Box>
            <Box>
              {selectedPriceListTypes && selectedPriceListTypes.length > 0 && (
                <Box sx={{ mx: 12, mb: 3 }}>
                  <RHFTextField
                    name="cashAccountAssignmentDefault"
                    label="Default Cash Account"
                    focused
                    inputProps={{ readOnly: true }}
                    sx={cursorTextDefault}
                  />
                </Box>
              )}
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mx: 12, fontWeight: 600, mb: 3 }}>
            Cheque Account Assignment
          </Typography>
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
                name="chequeAccountAssignmentUIds"
                placeholder="Cheque Accounts"
                options={distributorAccountsListTypeMap}
                control={control}
                rules={{ required: true }}
                disabled={true}
              />
            </Box>
            <Box>
              {selectedChequeAccounts && selectedChequeAccounts.length > 0 && (
                <Box sx={{ mx: 12, mb: 3 }}>
                  <RHFTextField
                    name="chequeAccountAssignmentDefault"
                    label="Default Cheque Account"
                    focused
                    inputProps={{ readOnly: true }}
                    sx={cursorTextDefault}
                  />
                </Box>
              )}
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mx: 12, fontWeight: 600, mb: 3 }}>
            Outstanding Account Assignment
          </Typography>
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
                name="outstandingAccountAssignmentUIds"
                placeholder="Outstanding Accounts"
                options={distributorAccountsListTypeMap}
                control={control}
                rules={{ required: true }}
                disabled={true}
              />
            </Box>
            <Box>
              {selectedOutstandingAccounts &&
                selectedOutstandingAccounts.length > 0 && (
                  <Box sx={{ mx: 12, mb: 3 }}>
                    <RHFTextField
                      name="outstandingAccountAssignmentDefault"
                      label="Default Outstanding Account"
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
            sx={cursorTextDefault}
            value={
              defaultValues.creationDate &&
              isValid(new Date(defaultValues.creationDate))
                ? format(new Date(defaultValues.creationDate), dateFormat)
                : ""
            }
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
            sx={cursorTextDefault}
            value={
              defaultValues.modifiedDate &&
              isValid(new Date(defaultValues.modifiedDate))
                ? format(new Date(defaultValues.modifiedDate), dateFormat)
                : ""
            }
            InputLabelProps={
              defaultValues.modifiedDate ? { shrink: true } : { shrink: false }
            }
          />
        </Box>
      </Grid>
    </FormProvider>
  );
}
