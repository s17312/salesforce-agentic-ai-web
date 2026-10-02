"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter, useSearchParams } from "next/navigation";
import PaidIcon from "@mui/icons-material/Paid";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import "./components/paymentEditStyles.css";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { useForm, useWatch } from "react-hook-form";
import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import {
  getBankBranchesByBankdID,
  getBanks,
  getInvoicePayments,
  getOutletBalance,
} from "@/service/tour-service/invoicePayment.service";
import { useSelector } from "@/redux/store";
import { enqueueSnackbar } from "notistack";
import dayjs from "dayjs";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { mapListToOptions } from "@/utils/sortUtils";
import { focusDataGridStyle } from "@/styles/tableStyles/tableStyle";
import { invoicePaymentSchema } from "@/utils/schemas/tour/invoicePaymentSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createTempInvoicePayment,
  getTempPayments,
} from "@/service/value-sale/valueInvoicePayment.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { getDistributorAssignedAccounts } from "@/service/distributor-accounts-service";

const PaymentInvoice = () => {
  const theme = useTheme();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [rows, setRows] = useState([] as any[]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTotalPaymentExceed, setIsTotalPaymentExceed] = useState(false);
  const selectedOutletInvoices = useSelector(
    (state) => state.tourSalesPaymentSlice.selectedOutletInvoices
  );
  const setOutStanding = useSelector(
    (state) => state.tourSalesPaymentSlice.outStanding
  );
  const banksList = useSelector((state) => state.tourSalesPaymentSlice.Banks);
  const branchesByBankIDList = useSelector(
    (state) => state.tourSalesPaymentSlice.BranchesByBankID
  );
  const distributorUId = useSelector((state) => state.tourSalesSlice.DistributorUId);
  const accountList = useSelector((state) => state.distributorAccountsSlice.distributorAssignedAccountsDetails);

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    setPaymentMethod(value);
  };
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId");
  const selectedRows = searchParams.get("selectedRows");
  const selectedRowsArray = selectedRows ? JSON.parse(selectedRows) : [];
  const saleInvoiceTypeUIds = searchParams.get("saleInvoiceTypeUIds");
  const saleInvoiceTypeUIdsArray = saleInvoiceTypeUIds
    ? JSON.parse(saleInvoiceTypeUIds)
    : [];
  const returnUrl = searchParams.get("returnUrl");
  const outletID = Number(searchParams.get("outletID"));

  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(invoicePaymentSchema),
    defaultValues: {
      cashPaymentdate: new Date(),
      chequePaymentdate: new Date(),
      chequeDate: new Date(),
    },
  });

  const { control, setValue, getValues, handleSubmit } = methods;

  useWatch({
    control,
    name: [
      "cashPayment",
      "cashPaymentdate",
      "bankName",
      "branch",
      "chequeNo",
      "chequeDate",
    ],
  });

  const cashPayment = getValues("cashPayment");
  const bankName = getValues("bankName");
  const branch = getValues("branch");
  const chequeNo = getValues("chequeNo");
  const chequeDate = getValues("chequeDate");
  const accountUId = getValues("accountUId");

  useEffect(() => {
    fetchGetInvoicePayments();
    fetchGetOutletBalance();
  }, []);

  useEffect(() => {
    if (paymentMethod === 2) {
      fetchGetBanks();
      fetchGetBankBranchesByBankdID(3);
    }
    fetchGetDistributorAssignedAccountDetails(distributorUId, paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    if (bankName) {
      const bankUID = banksList.find(
        (bank: any) => bank.bankCode === bankName
      ).bankUId;
      fetchGetBankBranchesByBankdID(bankUID);
    }
  }, [bankName]);

  useEffect(() => {
    if (Array.isArray(selectedOutletInvoices)) {
      const mappedInvoices = selectedOutletInvoices.map((invoice) => ({
        id: invoice.invoiceHeaderId,
        invoiceDate: invoice.invoiceDate,
        invoiceId: invoice.invoiceId,
        invAmount: invoice.invAmount,
        paidAmount: invoice.paidAmount,
        balanceAmount: invoice.balanceAmount,
        payment: invoice.balanceAmount,
        saleInvoiceTypeUId: invoice.saleInvoiceTypeUId,
      }));
      setRows(mappedInvoices);
    }
  }, [selectedOutletInvoices]);

  useEffect(() => {
    if (accountList && accountList.length > 0) {
      const defaultAccount = accountList.find((acc: any) => acc.isDefault === true);
      if (defaultAccount) {
        setValue("accountUId", defaultAccount.uId);
      }
    }
  }, [accountList, setValue]);

  const fetchGetInvoicePayments = async () => {
    try {
      await getInvoicePayments(selectedRowsArray, saleInvoiceTypeUIdsArray);
    } catch (error) {
      enqueueSnackbar("Error while fetching invoice payments", {
        variant: "error",
      });
    }
  };

  const fetchGetTempPayments = async () => {
    try {
      await getTempPayments(scheduleId, outletID);
    } catch (error) {
      enqueueSnackbar("Error while fetching temp payments", {
        variant: "error",
      });
    }
  };

  const fetchGetOutletBalance = async () => {
    try {
      await getOutletBalance(outletID);
    } catch (error) {
      enqueueSnackbar("Error while fetching outlet balance", {
        variant: "error",
      });
    }
  };

  const fetchGetBanks = async () => {
    try {
      await getBanks();
    } catch (error) {
      enqueueSnackbar("Error while fetching banks", {
        variant: "error",
      });
    }
  };

  const fetchGetBankBranchesByBankdID = async (bankId: number) => {
    try {
      await getBankBranchesByBankdID(bankId);
    } catch (error) {
      enqueueSnackbar("Error while fetching bank branches", {
        variant: "error",
      });
    }
  };

  const fetchGetDistributorAssignedAccountDetails = async (distributorId: number | null, paymentType: number) => {
    try {
      await getDistributorAssignedAccounts(distributorId, paymentType);
    } catch (error) {
      enqueueSnackbar("Error while fetching Accounts", {
        variant: "error",
      });
    }
  };

  const totalInvoiceAmount = useMemo(() => {
    return rows.reduce((acc, row) => acc + row.invAmount, 0);
  }, [rows]);

  const totalPaidAmount = useMemo(() => {
    return rows.reduce((acc, row) => acc + row.paidAmount, 0);
  }, [rows]);

  const totalBalanceAmount = useMemo(() => {
    return rows.reduce((acc, row) => acc + row.balanceAmount, 0);
  }, [rows]);

  const totalPayment = useMemo(() => {
    return rows.reduce((acc, row) => acc + row.payment, 0);
  }, [rows]);

  useEffect(() => {
    setValue("totalPayment", totalPayment);
    setValue("cashPayment", totalPayment);
  }, [totalPayment, rows]);

  const outStanding = useMemo(() => {
    if (cashPayment === undefined) {
      return 0;
    }

    if (totalPayment === 0) {
      return 0;
    }
    const outstandingAmount = cashPayment - totalPayment;
    const roundedOutstandingAmount = Math.round(outstandingAmount * 100) / 100;
    return roundedOutstandingAmount < 0 ? 0 : roundedOutstandingAmount;
  }, [cashPayment, totalPayment]);

  const handleRowUpdate = (
    newRow: GridRowModel
  ): GridValidRowModel | Promise<GridValidRowModel> => {
    let previousRowPayment =
      rows.find((row) => row.id === newRow.id)?.payment || 0;
    setIsTotalPaymentExceed(
      cashPayment < totalPayment - previousRowPayment + newRow.payment
    );

    // COMMENTED OUT FOR FUTURE USE
    // if (cashPayment < totalPayment - previousRowPayment + newRow.payment) {
    //   enqueueSnackbar(
    //     "Total payment must be less than or equal to cash payment",
    //     { variant: "error" }
    //   );
    //   newRow.payment = 0;
    //   return Promise.reject(
    //     new Error("Total payment must be less than or equal to cash payment")
    //   );
    // } else
    if (newRow.payment > newRow.balanceAmount) {
      enqueueSnackbar("Payment must be less than or equal to balance amount", {
        variant: "error",
      });
      newRow.payment = 0;
      return Promise.reject(
        new Error("Payment must be less than or equal to balance amount")
      );
    } else {
      const updatedRow = {
        ...newRow,
        payment: Number(newRow.payment),
      };

      setRows((prevRows) =>
        // @ts-ignore
        prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
      );

      return updatedRow;
    }
  };

  const handlePayCashClick = async () => {
    const invoicePaymentDetail = rows.map((row) => ({
      invoiceHeaderId: row.id,
      invoiceId: row.invoiceId,
      saleInvoiceTypeUId: row.saleInvoiceTypeUId,
      invoiceAmount: row.invAmount,
      paidAmount: row.paidAmount,
      balanceAmount: row.balanceAmount,
      payment: row.payment,
    }));

    const payload = {
      invoicePaymentHeader: {
        tourScheduleUId: scheduleId,
        outletUId: outletID,
        paymentDate: new Date().toISOString().split("T")[0],
        paymentType: paymentMethod,
        invoiceAmount: totalInvoiceAmount,
        paidAmount: totalPaidAmount,
        balanceAmount: totalBalanceAmount,
        cashAmount: Number(cashPayment),
        chequeAmount: 0,
        outstandingAmount: paymentMethod == 3 ? Number(cashPayment) : outStanding,
        outstandingPayment: outStanding,
        invoicePayment: 0,
        accountUId: accountUId
      },
      invoicePaymentDetail: invoicePaymentDetail,
      chequeDetails: {
        chequeNo: null,
        chequeDate: null,
        bankCode: null,
        branchCode: null,
      },
    };

    if (invoicePaymentDetail.some(detail => detail.payment === 0 || detail.payment === null)) {
      enqueueSnackbar("Please enter payment amount for all invoices", {
        variant: "error",
      });
      return;
    }

    if (cashPayment < totalPayment) {
      enqueueSnackbar("Cash payment insufficient for this payment", {
        variant: "error",
      });
    } else {
      try {
        const response = await createTempInvoicePayment(payload);
        enqueueSnackbar(`${response.message} | ${response.number}`, {
          variant: "success",
        });
        router.push(`${returnUrl}`);
      } catch (error) {
        console.error("Error while creating a cash payment", error);
      }
    }
  };

  const handlePayChequeClick = async () => {
    const invoicePaymentDetail = rows.map((row) => ({
      invoiceHeaderId: row.id,
      invoiceId: row.invoiceId,
      saleInvoiceTypeUId: row.saleInvoiceTypeUId,
      invoiceAmount: row.invAmount,
      paidAmount: row.paidAmount,
      balanceAmount: row.balanceAmount,
      payment: row.payment,
    }));

    const payload = {
      invoicePaymentHeader: {
        tourScheduleUId: scheduleId,
        outletUId: outletID,
        paymentDate: new Date().toISOString().split("T")[0],
        paymentType: paymentMethod,
        invoiceAmount: totalInvoiceAmount,
        paidAmount: totalPaidAmount,
        balanceAmount: totalBalanceAmount,
        cashAmount: 0,
        chequeAmount: Number(cashPayment),
        outstandingAmount: outStanding,
        outstandingPayment: outStanding,
        invoicePayment: 0,
        accountUId: accountUId
      },
      invoicePaymentDetail: invoicePaymentDetail,
      chequeDetails: {
        chequeNo: chequeNo,
        chequeDate: chequeDate.toISOString().split("T")[0],
        bankCode: bankName,
        branchCode: branch,
      },
    };

    if (cashPayment < totalPayment) {
      enqueueSnackbar("Cheque payment insufficient for this payment", {
        variant: "error",
      });
      return;
    }

    try {
      const response = await createTempInvoicePayment(payload);
      enqueueSnackbar(`${response.message} | ${response.number}`, {
        variant: "success",
      });
      router.push(`${returnUrl}`);
    } catch (error) {
      console.error("Error while creating invoice payment", error);
    }
  };

  const banksOptions = useMemo(
    () => mapListToOptions(banksList, "bankName", "bankCode"),
    [banksList, mapListToOptions]
  );

  const branchesOptions = useMemo(
    () => mapListToOptions(branchesByBankIDList, "branchName", "branchCode"),
    [branchesByBankIDList, mapListToOptions]
  );

  const accountsOptions = useMemo(
    () => mapListToOptions(accountList, "accountName", "uId"),
    [accountList, mapListToOptions]
  );

  const columns: GridColDef[] = [
    {
      field: "invoiceDate",
      headerName: "Date",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) => {
        const date = params.value;
        return date ? dayjs(date).format("MM/DD/YYYY") : "-";
      },
    },
    {
      field: "invoiceId",
      headerName: "Invoice ID",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "invAmount",
      headerName: "Invoice Amount",
      minWidth: 90,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      valueGetter: (params: any) => formatCurrency(params.row?.invAmount),
    },
    {
      field: "paidAmount",
      headerName: "Paid Amount",
      minWidth: 90,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      valueGetter: (params: any) => formatCurrency(params.row?.paidAmount),
    },
    {
      field: "balanceAmount",
      headerName: "Balance Amount",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      valueGetter: (params: any) => formatCurrency(params.row?.balanceAmount),
    },
    {
      field: "payment",
      headerName: "Payment",
      minWidth: 100,
      flex: 0.5,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      editable: true,
      type: "number",
      cellClassName: "editable-cell",
      // valueGetter: (params: any) => formatCurrency(params.row?.payment),
      preProcessEditCellProps: (params) => {
        const hasError =
          params.props.value < 0 || params.props.value.toString().includes("e");
        return { ...params.props, error: hasError };
      },
    },
  ];

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Invoice Payment"
        pageNavigation={[
          {
            pageName: "Sales Invoice",
            path: `${returnUrl}`,
          },
          { pageName: "Payment" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<PaidIcon sx={{ color: theme.palette.primary.main }} />}
      />

      <Container>
        <DataGrid
          sx={{
            height: "auto",
            width: "100%",
            "& .MuiDataGrid-virtualScroller": {
              overflow: "hidden !important",
            },
            ...focusDataGridStyle,
          }}
          rows={rows}
          columns={getColumnsWithTooltip(columns)}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          processRowUpdate={handleRowUpdate}
          density="compact"
          hideFooter
          disableRowSelectionOnClick
          disableColumnMenu
        />

        {/* 3 Radio Buttons cash, cheque, outstanding */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <FormControl component="fieldset" sx={{ mt: 4 }}>
              <FormLabel
                component="legend"
                sx={{ color: theme.palette.primary.main, mb: 2 }}
              >
                Select Payment Method
              </FormLabel>
              <RadioGroup
                row
                aria-label="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel
                  sx={{ color: theme.palette.primary.main, mr: 8 }}
                  value={1}
                  control={<Radio />}
                  label="Cash"
                />
                <FormControlLabel
                  sx={{ color: theme.palette.primary.main, mr: 8 }}
                  value={2}
                  control={<Radio />}
                  label="Cheque"
                />
                <FormControlLabel
                  sx={{ color: theme.palette.primary.main, mr: 8 }}
                  value={3}
                  control={<Radio />}
                  label="Outstanding"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={6} container justifyContent="flex-end">
            <Box
              sx={{
                textAlign: "right",
                p: 2,
                backgroundColor: "#dad7e4",
                borderRadius: 2,
                display: "inline-block",
              }}
            >
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ color: theme.palette.primary.main }}
              >
                Outstanding: {formatCurrency(setOutStanding.outletBalance)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {/* Header details */}
        <Box sx={{ mt: 2 }}>
          <FormProvider methods={methods}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {paymentMethod === 1 && (
                <Grid item xs={3}>
                  <RHFDatePicker
                    name="cashPaymentdate"
                    label="Payment Date"
                    disableFuture={false}
                    disablePast={true}
                    onChange={(date: any) => {
                      setValue("cashPaymentdate", date);
                    }}
                    disabled
                    format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
                    value={new Date()}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              )}
              {paymentMethod === 2 && (
                <>
                  <Grid item xs={4}>
                    <RHFAutocompleteField
                      name="bankName"
                      placeholder="Bank*"
                      options={banksOptions}
                      control={control}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                    />
                  </Grid>
                  {/* branch */}
                  <Grid item xs={4}>
                    <RHFAutocompleteField
                      name="branch"
                      placeholder="Bank Branch*"
                      options={branchesOptions}
                      control={control}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      disabled={!bankName}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <RHFTextField
                      name="chequeNo"
                      label="Cheque No"
                      rules={{
                        required: "Cheque No is required",
                        minLength: {
                          value: 13,
                          message: "Must be exactly 13 characters",
                        },
                        maxLength: {
                          value: 13,
                          message: "Must be exactly 13 characters",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <RHFDatePicker
                      name="chequePaymentdate"
                      label="Payment Date"
                      disableFuture={false}
                      disablePast={true}
                      onChange={(date: any) => {
                        setValue("paymentdate", date);
                      }}
                      format={
                        process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                      }
                      value={null}
                      renderInput={(params) => <TextField {...params} />}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <RHFDatePicker
                      name="chequeDate"
                      label="Cheque Date"
                      disableFuture={false}
                      disablePast={true}
                      onChange={(date: any) => {
                        setValue("chequeDate", date);
                      }}
                      format={
                        process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"
                      }
                      value={new Date()}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={3}>
                <RHFAutocompleteField
                  name="accountUId"
                  placeholder="Account*"
                  options={accountsOptions}
                  control={control}
                  inputProps={{
                    form: {
                      autocomplete: "off",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Grid
                  container
                  rowSpacing={2}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Grid container alignItems="center">
                        <Grid item sx={{ width: "160px" }}>
                          <FormLabel sx={{ color: theme.palette.primary.main }}>
                            Invoice Amount
                          </FormLabel>
                        </Grid>
                        <Grid item xs>
                          <RHFTextField
                            name="invoiceAmt"
                            fullWidth
                            value={formatCurrency(totalInvoiceAmount)}
                            disabled
                          />
                        </Grid>
                      </Grid>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Grid container alignItems="center">
                        <Grid item sx={{ width: "160px" }}>
                          <FormLabel sx={{ color: theme.palette.primary.main }}>
                            Paid Amount
                          </FormLabel>
                        </Grid>
                        <Grid item xs>
                          <RHFTextField
                            name="paidAmt"
                            fullWidth
                            value={formatCurrency(totalPaidAmount)}
                            disabled
                          />
                        </Grid>
                      </Grid>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Grid container alignItems="center">
                        <Grid item sx={{ width: "160px" }}>
                          <FormLabel sx={{ color: theme.palette.primary.main }}>
                            Balance Amount
                          </FormLabel>
                        </Grid>
                        <Grid item xs>
                          <RHFTextField
                            name="balanceAmt"
                            fullWidth
                            value={formatCurrency(totalBalanceAmount)}
                            disabled
                          />
                        </Grid>
                      </Grid>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Grid container alignItems="center">
                        <Grid item sx={{ width: "160px" }}>
                          <FormLabel sx={{ color: theme.palette.primary.main }}>
                            {paymentMethod == 1
                              ? "Cash Payment"
                              : paymentMethod == 2
                                ? "Cheque Payment"
                                : "Outstanding Payment"}
                          </FormLabel>
                        </Grid>
                        <Grid item xs>
                          <RHFTextField
                            name="cashPayment"
                            fullWidth
                            type="number"
                            inputProps={{ min: 0 }}
                            disabled={paymentMethod === 3}
                            onKeyDown={(e) => {
                              if (
                                e.key === "-" ||
                                e.key === "+" ||
                                e.key === "e"
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Grid container alignItems="center">
                        <Grid item sx={{ width: "160px" }}>
                          <FormLabel sx={{ color: theme.palette.primary.main }}>
                            Total Payment
                          </FormLabel>
                        </Grid>
                        <Grid item xs>
                          <RHFTextField
                            name="totalPayment"
                            fullWidth
                            value={formatCurrency(totalPayment)}
                            disabled
                          />
                        </Grid>
                      </Grid>
                    </FormControl>
                    {paymentMethod == 3 ? null :
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Grid container alignItems="center">
                          <Grid item sx={{ width: "160px" }}>
                            <FormLabel sx={{ color: theme.palette.primary.main }}>
                              Outstanding Payment
                            </FormLabel>
                          </Grid>
                          <Grid item xs>
                            {outStanding === 0 ? (
                              <TextField
                                disabled
                                fullWidth
                                value={"0"}
                                size="small"
                              />
                            ) : (
                              <RHFTextField
                                name="outstandingPayment"
                                fullWidth
                                value={formatCurrency(outStanding)}
                                disabled
                              />
                            )}
                          </Grid>
                        </Grid>
                      </FormControl>
                    }
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    display="flex"
                    alignItems="flex-end"
                    justifyContent="flex-end"
                  >
                    <Box>
                      {paymentMethod === 1 && (
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ mr: 1 }}
                          onClick={handlePayCashClick}
                          disabled={
                            totalPayment === 0 ||
                            cashPayment === 0 ||
                            cashPayment == null
                            // isTotalPaymentExceed
                          }
                        >
                          Pay with Cash
                        </Button>
                      )}
                      {paymentMethod === 2 && (
                        <Button
                          variant="outlined"
                          color="primary"
                          type="submit"
                          sx={{ mr: 1 }}
                          onClick={handleSubmit(handlePayChequeClick)}
                          disabled={
                            totalPayment === 0 ||
                            cashPayment === 0 ||
                            cashPayment == null ||
                            !bankName ||
                            !branch ||
                            !chequeNo
                            // isTotalPaymentExceed
                          }
                        >
                          Pay with Cheque
                        </Button>
                      )}
                      {paymentMethod === 3 && (
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ mr: 1 }}
                          onClick={handlePayCashClick}
                          disabled={
                            totalPayment === 0 ||
                            cashPayment === 0 ||
                            cashPayment == null
                          }
                        >
                          Pay with Outstanding
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </FormProvider>
        </Box>
      </Container>
    </FsBox>
  );
};

export default PaymentInvoice;
