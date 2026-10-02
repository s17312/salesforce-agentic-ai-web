"use client";

import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllAssetDetailsByLocation } from "@/service/asset.service";
import { getAllAssetAllocationTypeDetails } from "@/service/assetAllocationType.service";
import {
  getAllActiveDistributors,
  getAllActiveOutletsByDistributorRepRoute,
  getAllActiveRepByDistriID,
  getAllActiveRoutesByRepID,
} from "@/service/outletTransfer.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import {
  Box,
  Button,
  Card,
  Checkbox,
  CssBaseline,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { createAssetTransaction } from "@/service/assetTransfer.service";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormValuesPropsAssetTransaction } from "@/types/asset-transfer-types";
import { assetTransferValidationSchema } from "@/utils/schemas/assetTransaferSchema";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

export interface Asset {
  uId: string;
  assetId: string;
  assetName: string;
}

const AssetTransfer = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const { assetAllocationTypeDetails: assetAllocationTypeDetails } =
    useSelector((state) => state.assetAllocatioTypeSlice);

  const [distributorFrom, setDistributorFrom] = useState([]);
  const [repOptionsFrom, setRepOptionsFrom] = useState([]);
  const [routeOptionsFrom, setRouteOptionsFrom] = useState([]);
  const [outletOptionsFrom, setOutletOptionsFrom] = useState([]);
  const [distributorTo, setDistributorTo] = useState([]);
  const [repOptionsTo, setRepOptionsTo] = useState([]);
  const [routeOptionsTo, setRouteOptionsTo] = useState([]);
  const [outletOptionsTo, setOutletOptionsTo] = useState([]);
  const [assetList, setAssetList] = useState<Asset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [transferredAssets, setTransferredAssets] = useState<Asset[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const methods = useForm<FormValuesPropsAssetTransaction>({
    //@ts-ignore
    resolver: yupResolver(assetTransferValidationSchema),
    mode: "all",
    defaultValues: {
      transactionId: "",
      transactionDate: undefined,
    },
  });

  const { handleSubmit, reset, setValue, control, watch, getValues } = methods;

  const handleAssetSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    assetUId: string
  ) => {
    if (event.target.checked) {
      if (!transferredAssets.find((asset) => asset.uId === assetUId)) {
        setSelectedAssets((prev) => [...prev, assetUId]);
      }
    } else {
      setSelectedAssets((prev) =>
        prev.filter((selectedAsset) => selectedAsset !== assetUId)
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllAssetAllocationTypeDetails(
            undefined,
            undefined,
            undefined,
            "allocationType",
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

  const fetchDistributorFrom = async () => {
    try {
      const ActiveDistributorsRes = await getAllActiveDistributors();
      setDistributorFrom(ActiveDistributorsRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchRepOptionsFrom = async (distributorId: number) => {
    try {
      const repOptionsRes = await getAllActiveRepByDistriID(distributorId);
      setRepOptionsFrom(repOptionsRes);
    } catch (error) {
      console.error("Error fetching rep options:", error);
    }
  };
  const fetchRouteOptionsFrom = async (repId: number) => {
    try {
      const routeOptionsRes = await getAllActiveRoutesByRepID(repId);
      setRouteOptionsFrom(routeOptionsRes);
    } catch (error) {
      console.error("Error fetching route options:", error);
    }
  };

  const fetchOutletOptionsFrom = async (
    distributorId: number,
    repId: number,
    routeId: number
  ) => {
    try {
      const outletListRes = await getAllActiveOutletsByDistributorRepRoute(
        distributorId,
        repId,
        routeId
      );
      setOutletOptionsFrom(outletListRes);
    } catch (error) {
      console.error("Error fetching outlet list:", error);
    }
  };

  const fetchDistributorTo = async () => {
    try {
      const ActiveDistributorsRes = await getAllActiveDistributors();
      setDistributorTo(ActiveDistributorsRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchRepOptionsTo = async (distributorId: number) => {
    try {
      const repOptionsRes = await getAllActiveRepByDistriID(distributorId);
      setRepOptionsTo(repOptionsRes);
    } catch (error) {
      console.error("Error fetching rep options:", error);
    }
  };
  const fetchRouteOptionsTo = async (repId: number) => {
    try {
      const routeOptionsRes = await getAllActiveRoutesByRepID(repId);
      setRouteOptionsTo(routeOptionsRes);
    } catch (error) {
      console.error("Error fetching route options:", error);
    }
  };

  const fetchOutletOptionsTo = async (
    distributorId: number,
    repId: number,
    routeId: number
  ) => {
    try {
      const outletListRes = await getAllActiveOutletsByDistributorRepRoute(
        distributorId,
        repId,
        routeId
      );
      setOutletOptionsTo(outletListRes);
    } catch (error) {
      console.error("Error fetching outlet list:", error);
    }
  };

  const fetchAssetOptionsFrom = async (
    locationTypeUId?: number,
    locationUId?: number
  ) => {
    try {
      const assetListRes = await getAllAssetDetailsByLocation(
        undefined,
        undefined,
        undefined,
        "assetName",
        "asc",
        true,
        false,
        locationTypeUId,
        locationUId,
        undefined
      );

      setAssetList(assetListRes);
    } catch (error) {
      console.error("Error fetching asset list:", error);
    }
  };

  useEffect(() => {
    fetchDistributorFrom();
    fetchDistributorTo();
  }, []);

  const fromLocationType = watch("fromLocationType");
  const toLocationType = watch("toLocationType");
  const fromLocationUId = watch("fromLocationUId");
  const toLocationUId = watch("toLocationUId");
  const fromDistributor = watch("fromDistributor");
  const fromRep = watch("fromRep");
  const fromRoute = watch("fromRoute");
  const toDistributor = watch("toDistributor");
  const toRep = watch("toRep");
  const toRoute = watch("toRoute");

  useEffect(() => {
    if (fromDistributor) {
      fetchRepOptionsFrom(fromDistributor);
    } else {
      setRepOptionsFrom([]);
    }
  }, [fromDistributor]);

  useEffect(() => {
    if (fromRep) {
      fetchRouteOptionsFrom(fromRep);
    } else {
      setRouteOptionsFrom([]);
    }
  }, [fromRep]);

  useEffect(() => {
    if (fromDistributor && fromRep && fromRoute) {
      fetchOutletOptionsFrom(fromDistributor, fromRep, fromRoute);
    } else {
      setOutletOptionsFrom([]);
    }
  }, [fromDistributor, fromRep, fromRoute]);

  useEffect(() => {
    if (fromLocationType && fromLocationUId) {
      fetchAssetOptionsFrom(fromLocationType, fromLocationUId);
    } else {
      setAssetList([]);
    }
  }, [fromLocationUId]);

  useEffect(() => {
    if (toDistributor) {
      fetchRepOptionsTo(toDistributor);
    } else {
      setRepOptionsTo([]);
    }
  }, [toDistributor]);

  useEffect(() => {
    if (toRep) {
      fetchRouteOptionsTo(toRep);
    } else {
      setRouteOptionsTo([]);
    }
  }, [toRep]);

  useEffect(() => {
    if (toDistributor && toRep && toRoute) {
      fetchOutletOptionsTo(toDistributor, toRep, toRoute);
    } else {
      setOutletOptionsTo([]);
    }
  }, [toDistributor, toRep, toRoute]);

  const mapListToOptions = (list: any[], labelKey: string, valueKey: string) =>
    list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  const allocationTypeMap = mapListToOptions(
    assetAllocationTypeDetails,
    "allocationType",
    "uId"
  );
  const filteredAllocationTypeMap = allocationTypeMap.filter(
    (item) => item.value === 2 || item.value === 3
  );
  const fromDistributorsMap = mapListToOptions(
    distributorFrom,
    "distributorName",
    "uId"
  );
  const fromRepMap = mapListToOptions(repOptionsFrom, "name", "uId");
  const fromRouteMap = mapListToOptions(routeOptionsFrom, "routeName", "uId");
  const fromOutletMap = mapListToOptions(outletOptionsFrom, "name", "uId");

  const toDistributorsMap = mapListToOptions(
    distributorTo,
    "distributorName",
    "uId"
  );
  const toRepMap = mapListToOptions(repOptionsTo, "name", "uId");
  const toRouteMap = mapListToOptions(routeOptionsTo, "routeName", "uId");
  const toOutletMap = mapListToOptions(outletOptionsTo, "name", "uId");

  const handleReset = () => {
    reset({
      transactionId: "",
      transactionDate: undefined,
    });
    setTransferredAssets([]);
    setAssetList([]);
  };

  const areLocationSelected = fromLocationUId && toLocationUId;

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const createPayload = (isCopy: boolean) => {
    const transactionDate = getValues("transactionDate");

    return {
      transactionId: getValues("transactionId"),
      assetUIds: selectedAssets.map((uId) => Number(uId)),
      fromLocationType: String(getValues("fromLocationType")),
      fromLocationUId: getValues("fromLocationUId"),
      toLocationType: String(getValues("toLocationType")),
      toLocationUId: getValues("toLocationUId"),
      transactionType: "Transfer",
      transactionDate: transactionDate
        ? format(new Date(transactionDate), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
    };
  };

  const handleCreateAssetTransfer = async () => {
    try {
      if (selectedAssets.length === 0) {
        enqueueSnackbar("Please select at least one asset to transfer.", {
          variant: "warning",
        });
        return;
      }

      const formattedData = createPayload(false);

      const res = await createAssetTransaction(formattedData);
      setTransferredAssets((prev) => {
        const newTransferredAssets = assetList.filter((asset) =>
          selectedAssets.includes(asset.uId)
        );
        const updatedAssets = [...prev, ...newTransferredAssets];
        return updatedAssets;
      });
      setAssetList((prev) =>
        prev.filter((asset) => !selectedAssets.includes(asset.uId))
      );

      setSelectedAssets([]);
      enqueueSnackbar(`${res.data.message}`, { variant: "success" });
    } catch (error: any) {
      console.error("Error transferring assets:", error);
    }
  };

  useEffect(() => {
    if (!fromDistributor) {
      setValue("fromRep", null);
      setValue("fromRoute", null);
    }
    if (!fromRep) {
      setValue("fromRoute", null);
    }
  }, [fromDistributor, fromRep, setValue]);

  useEffect(() => {
    if (!toDistributor) {
      setValue("toRep", null);
      setValue("toRoute", null);
    }
    if (!toRep) {
      setValue("toRoute", null);
    }
  }, [toDistributor, toRep, setValue]);

  useEffect(() => {
    setValue("fromDistributor", null);
    setValue("fromRep", null);
    setValue("fromRoute", null);
    setValue("fromLocationUId", null);
    setSelectedAssets([]);
  }, [fromLocationType, setValue]);

  useEffect(() => {
    setValue("toDistributor", null);
    setValue("toRep", null);
    setValue("toRoute", null);
    setValue("toLocationUId", null);
  }, [toLocationType, setValue]);

  useEffect(() => {
    setTransferredAssets([]);
  }, [
    fromDistributor,
    fromRep,
    fromRoute,
    toDistributor,
    toRep,
    toRoute,
    fromLocationUId,
    toLocationUId,
    setValue,
  ]);

  useEffect(() => {
    setSelectedAssets([]);
    setTransferredAssets([]);
    setAssetList([]);
  }, [fromDistributor, fromRep, fromRoute, fromLocationUId, setValue]);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <CssBaseline />
      <BreadcrumbNavigation
        pageTitle="Asset Transfer"
        pageNavigation={[
          { pageName: "Home", path: PATH_DASHBOARD.root },
          { pageName: "Asset Transfer" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
        icon={<MoveUpIcon color="primary" />}
      />
      <Container>
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(handleCreateAssetTransfer)}
        >
          <Card
            sx={{
              padding: 4,
              width: "100%",
              height: "100%",
              minHeight: "55vh",
              margin: "auto",
              backgroundColor: "#fafafa",
              border: "1px solid white",
              overflow: "hidden",
            }}
          >
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={6}>
                <Grid item xs={12}>
                  <RHFTextField name="transactionId" label="Code*" />
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid item xs={12}>
                  <RHFDatePicker
                    name="transactionDate"
                    label="Transfer Date*"
                    disablePast={true}
                    onChange={(date: any) => {
                      setValue("transactionDate", date);
                    }}
                    format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
                    value={
                      getValues("transactionDate")
                        ? new Date(getValues("transactionDate"))
                        : new Date()
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {/* From Section */}
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ mb: 2 }} color={"primary"}>
                  From
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <RHFAutocompleteField
                      name="fromLocationType"
                      placeholder="From Type*"
                      options={filteredAllocationTypeMap}
                      control={control}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                    />
                  </Grid>
                  {fromLocationType &&
                    (Number(fromLocationType) === 2 ||
                      Number(fromLocationType) === 3) && (
                      <hr
                        style={{
                          margin: "16px 0",
                          border: "0",
                          borderTop: "1px solid #BDC1E4",
                        }}
                      />
                    )}
                  {/* Section 2: Conditional Fields based on Allocation Type */}
                  {fromLocationType && Number(fromLocationType) === 2 && (
                    <Grid item xs={12}>
                      <RHFAutocompleteField
                        name="fromLocationUId"
                        placeholder="Distributor*"
                        options={fromDistributorsMap}
                        control={control}
                        inputProps={{
                          form: {
                            autocomplete: "off",
                          },
                        }}
                      />
                    </Grid>
                  )}
                  {fromLocationType && Number(fromLocationType) === 3 && (
                    <>
                      <Grid item xs={12}>
                        <RHFAutocompleteField
                          name="fromDistributor"
                          placeholder="Distributor*"
                          options={fromDistributorsMap}
                          control={control}
                          inputProps={{
                            form: {
                              autocomplete: "off",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <RHFAutocompleteField
                          name="fromRep"
                          placeholder="Rep*"
                          options={fromRepMap}
                          control={control}
                          inputProps={{
                            form: {
                              autocomplete: "off",
                            },
                          }}
                          disabled={!fromDistributor}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <RHFAutocompleteField
                          name="fromRoute"
                          placeholder="Route*"
                          options={fromRouteMap}
                          control={control}
                          inputProps={{
                            form: {
                              autocomplete: "off",
                            },
                          }}
                          disabled={!fromDistributor || !fromRep}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <RHFAutocompleteField
                          name="fromLocationUId"
                          placeholder="Outlet*"
                          options={fromOutletMap}
                          control={control}
                          inputProps={{
                            form: {
                              autocomplete: "off",
                            },
                          }}
                          disabled={!fromDistributor || !fromRep || !fromRoute}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>

                {/*From Asset List */}
                <List
                  style={{
                    marginTop: "16px",
                    border: "1px solid lightgrey",
                    height: "100%",
                    overflowY: "scroll",
                  }}
                >
                  {assetList.map((asset) => {
                    const isTransferred = transferredAssets.some(
                      (transferredAsset) => transferredAsset.uId === asset.uId
                    );
                    return (
                      <ListItem key={asset.uId} dense button>
                        <Checkbox
                          checked={selectedAssets.includes(asset.uId)}
                          onChange={(event) =>
                            handleAssetSelect(event, asset.uId)
                          }
                          disabled={isTransferred}
                        />
                        <ListItemText
                          primary={asset.assetName}
                          secondary={isTransferred ? "Transferred" : null}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>

              {/* To Section */}
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ mb: 2 }} color={"primary"}>
                  To
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <RHFAutocompleteField
                      name="toLocationType"
                      placeholder="To Type*"
                      options={filteredAllocationTypeMap}
                      control={control}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                    />
                  </Grid>

                  {toLocationType &&
                    (Number(toLocationType) === 2 ||
                      Number(toLocationType) === 3) && (
                      <hr
                        style={{
                          margin: "16px 0",
                          border: "0",
                          borderTop: "1px solid #BDC1E4",
                        }}
                      />
                    )}
                  {/* Section 2: Conditional Fields based on Allocation Type */}
                  {toLocationType && Number(toLocationType) === 2 && (
                    <Grid item xs={12}>
                      <RHFAutocompleteField
                        name="toLocationUId"
                        placeholder="Distributor*"
                        options={toDistributorsMap}
                        control={control}
                        inputProps={{
                          form: {
                            autocomplete: "off",
                          },
                        }}
                      />
                    </Grid>
                  )}
                  {toLocationType && Number(toLocationType) === 3 && (
                    <>
                      <Grid item xs={12}>
                        <RHFAutocompleteField
                          name="toDistributor"
                          placeholder="Distributor*"
                          options={toDistributorsMap}
                          control={control}
                          inputProps={{
                            form: {
                              autocomplete: "off",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <RHFAutocompleteField
                          name="toRep"
                          placeholder="Rep*"
                          options={toRepMap}
                          control={control}
                          inputProps={{
                            form: {
                              autocomplete: "off",
                            },
                          }}
                          disabled={!toDistributor}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <RHFAutocompleteField
                          name="toRoute"
                          placeholder="Route*"
                          options={toRouteMap}
                          control={control}
                          inputProps={{
                            form: {
                              autocomplete: "off",
                            },
                          }}
                          disabled={!toDistributor || !toRep}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <RHFAutocompleteField
                          name="toLocationUId"
                          placeholder="Outlet*"
                          options={toOutletMap}
                          control={control}
                          inputProps={{
                            form: {
                              autocomplete: "off",
                            },
                          }}
                          disabled={!toDistributor || !toRep || !toRoute}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                {/*Transferred Asset List */}
                <List
                  style={{
                    marginTop: "16px",
                    border: "1px solid lightgrey",
                    height: "100%",
                    overflowY: "scroll",
                  }}
                >
                  {transferredAssets.map((asset) => {
                    return (
                      <ListItem key={asset.uId}>
                        <ListItemText primary={asset?.assetName} />
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
            </Grid>
          </Card>
          {/* Buttons */}
          <Box
            sx={{
              mt: 2,
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Button
                variant="outlined"
                onClick={handleReset}
                fullWidth
                sx={{ mb: 1 }}
                startIcon={<RestartAltIcon />}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<SendRoundedIcon />}
                disabled={!areLocationSelected}
              >
                Transfer Assets
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Container>
    </FsBox>
  );
};

export default AssetTransfer;
