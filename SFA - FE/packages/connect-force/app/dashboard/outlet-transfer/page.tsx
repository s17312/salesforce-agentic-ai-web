"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { PATH_DASHBOARD } from "@/routes/paths";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
} from "@mui/material";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { RHFAutocompleteField } from "@/components/hook-form";
import { useForm } from "react-hook-form";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SendTimeExtensionRoundedIcon from "@mui/icons-material/SendTimeExtensionRounded";
import {
  getAllActiveDistributors,
  getAllActiveRepByDistriID,
  getAllActiveRoutesByRepID,
  updateOutletTransferBulk,
  getAllActiveOutletsByRoute,
} from "@/service/outletTransfer.service";
import { enqueueSnackbar } from "notistack";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

export interface Outlet {
  uId: string;
  outletID: string;
  outletUId: string;
  outletId: string;
  name: string;
}

const OutletTransfer = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>([]);
  const [distributorFrom, setDistributorFrom] = useState([]);
  const [repOptionsFrom, setRepOptionsFrom] = useState([]);
  const [routeOptionsFrom, setRouteOptionsFrom] = useState([]);
  const [distributorTo, setDistributorTo] = useState([]);
  const [repOptionsTo, setRepOptionsTo] = useState([]);
  const [routeOptionsTo, setRouteOptionsTo] = useState([]);
  const [outletList, setOutletList] = useState<Outlet[]>([]);
  const [toOutletList, setToOutletList] = useState<Outlet[]>([]);
  const [toSelectedOutlets, setToSelectedOutlets] = useState<string[]>([]);

  const methods = useForm({ mode: "all" });
  const { control, watch, setValue, getValues, reset } = methods;
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const handleOutletSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    outlet: string
  ) => {
    if (event.target.checked) {
      setSelectedOutlets([...selectedOutlets, outlet]);
      setToSelectedOutlets([...toSelectedOutlets, outlet]);
    } else {
      setSelectedOutlets(
        selectedOutlets.filter((selectedOutlet) => selectedOutlet !== outlet)
      );
      setToSelectedOutlets(
        toSelectedOutlets.filter((selectedOutlet) => selectedOutlet !== outlet)
      );
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Select all outlets
      const allOutletIds = outletList.map((outlet) => outlet.outletUId);
      setSelectedOutlets(allOutletIds);
      setToSelectedOutlets(allOutletIds);
    } else {
      // Deselect all outlets
      setSelectedOutlets([]);
      setToSelectedOutlets([]);
    }
  };

  const isAllSelected =
    selectedOutlets.length === outletList.length && outletList.length > 0;

  const handleReset = () => {
    reset({
      fromDistributor: null,
      fromRep: null,
      fromRoute: null,
      toDistributor: null,
      toRep: null,
      toRoute: null,
      toSelectedOutlets: null,
    });
    setRepOptionsFrom([]);
    setRouteOptionsTo([]);
    setSelectedOutlets([]);
    setOutletList([]);
    setToOutletList([]);
    setToSelectedOutlets([]);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const fetchDistributorFrom = async () => {
    try {
      const ActiveDistributorsRes = await getAllActiveDistributors();
      setDistributorFrom(ActiveDistributorsRes);
    } catch (error) {
      console.error("Error fetching data:", error);
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
  const fetchRepOptionsFrom = async (distributorId: number) => {
    try {
      const repOptionsRes = await getAllActiveRepByDistriID(distributorId);
      setRepOptionsFrom(repOptionsRes);
    } catch (error) {
      console.error("Error fetching rep options:", error);
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

  const fetchRouteOptionsFrom = async (repId: number) => {
    try {
      const routeOptionsRes = await getAllActiveRoutesByRepID(repId);
      setRouteOptionsFrom(routeOptionsRes);
    } catch (error) {
      console.error("Error fetching route options:", error);
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

  const fetchOutletList = async (
    distributorId: number,
    repId: number,
    routeId: number
  ) => {
    try {
      const outletListRes = await getAllActiveOutletsByRoute(
        routeId
      );
      setOutletList(outletListRes);
    } catch (error) {
      console.error("Error fetching outlet list:", error);
    }
  };

  const fetchToOutletList = async (
    distributorId: number,
    repId: number,
    routeId: number
  ) => {
    try {
      const outletListRes = await getAllActiveOutletsByRoute(
        routeId
      );
      setToOutletList(outletListRes);
    } catch (error) {
      console.error("Error fetching outlet list:", error);
    }
  };

  useEffect(() => {
    fetchDistributorFrom();
    fetchDistributorTo();
  }, []);

  // Watch form values
  const fromDistributor = watch("fromDistributor");
  const fromRep = watch("fromRep");
  const fromRoute = watch("fromRoute");
  const toDistributor = watch("toDistributor");
  const toRep = watch("toRep");
  const toRoute = watch("toRoute");

  useEffect(() => {
    if (fromDistributor) {
      reset({
        fromDistributor,
        fromRep: null,
        fromRoute: null,
        toDistributor: null,
        toRep: null,
        toRoute: null,
        toSelectedOutlets: null,
        outletList: null,
      });
      setRepOptionsFrom([]);
      setRouteOptionsFrom([]);
      setSelectedOutlets([]);
      setOutletList([]);
      setRouteOptionsTo([]);
      setToOutletList([]);
      setToSelectedOutlets([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDistributor, reset]);

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
    if (toDistributor && toRep && toRoute) {
      fetchToOutletList(toDistributor, toRep, toRoute);
    } else {
      setToOutletList([]);
    }
  }, [toDistributor, toRep, toRoute]);

  useEffect(() => {
    if (fromDistributor && fromRep && fromRoute) {
      fetchOutletList(fromDistributor, fromRep, fromRoute);
    } else {
      setOutletList([]);
    }
  }, [fromDistributor, fromRep, fromRoute]);

  const createPayload = (isCopy: boolean) => {
    const fromData = {
      oldDistributorUId: getValues("fromDistributor"),
      oldRepresentativeUId: getValues("fromRep"),
      oldRouteUId: getValues("fromRoute"),
    };

    const toData = {
      distributorUId: getValues("toDistributor"),
      representativeUId: getValues("toRep"),
      routeUId: getValues("toRoute"),
    };

    const list = selectedOutlets.map((outletUId) => ({ outletUId }));

    return {
      oldOutletTransfer: fromData,
      newOutletTransfer: toData,
      isCopy,
      list,
    };
  };

  const handleTransferOutlets = async (isCopy: boolean) => {
    const payload = createPayload(isCopy);
    try {
      const res = await updateOutletTransferBulk(payload);
      fetchToOutletList(toDistributor, toRep, toRoute);
      fetchOutletList(fromDistributor, fromRep, fromRoute);
      enqueueSnackbar(`${res.data.message}`, { variant: "success" });
    } catch (error) {
      console.error("Error transferring outlets:", error);
    }
  };

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

  const mapListToOptions = (list: any[], labelKey: string, valueKey: string) =>
    list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  const fromDistributorsMap = mapListToOptions(
    distributorFrom,
    "distributorName",
    "uId"
  );
  const fromRepMap = mapListToOptions(repOptionsFrom, "name", "uId");
  const fromRouteMap = mapListToOptions(routeOptionsFrom, "routeName", "routeUId");

  const toDistributorsMap = mapListToOptions(
    distributorTo,
    "distributorName",
    "uId"
  );
  const toRepMap = mapListToOptions(repOptionsTo, "name", "uId");
  const toRouteMap = mapListToOptions(routeOptionsTo, "routeName", "routeUId");

  // Clear fields based on conditions
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

  // Check if both routes are selected
  const areRoutesSelected = fromRoute && toRoute;
  

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <CssBaseline />
      <BreadcrumbNavigation
        pageTitle="Outlet Transfer"
        pageNavigation={[
          { pageName: "Home", path: PATH_DASHBOARD.root },
          { pageName: "Outlet Transfer" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
        icon={<MoveUpIcon color="primary" />}
      />
      <Container>
        <Card
          sx={{
            padding: 4,
            width: "100%",
            height: 800,
            margin: "auto",
            backgroundColor: "#fafafa",
            border: "1px solid white",
          }}
        >
          <Grid container spacing={2}>
            {/* From Section */}
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ mb: 2 }} color={"primary"}>
                From
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <RHFAutocompleteField
                    name="fromDistributor"
                    placeholder="Distributor"
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
                    placeholder="Rep"
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
                    placeholder="Route"
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
              </Grid>

              {/* Outlet List */}

              <List
                style={{
                  marginTop: "16px",
                  border: "1px solid lightgrey",
                  height: "50%",
                  overflowY: "scroll",
                }}
              >
                {outletList.length > 0 && (
                  <>
                    {/* Select All Checkbox */}
                    <ListItem dense button>
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={
                          selectedOutlets.length > 0 &&
                          selectedOutlets.length < outletList.length
                        }
                        onChange={handleSelectAll}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": "select-all" }}
                      />
                      <ListItemText primary="Select All" />
                    </ListItem>

                    {/* Individual Outlets */}
                    {outletList.map((outlet) => (
                      <ListItem key={outlet.outletUId} dense button>
                        <Checkbox
                          checked={selectedOutlets.includes(outlet.outletUId)}
                          onChange={(event) =>
                            handleOutletSelect(event, outlet.outletUId)
                          }
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": outlet.outletUId }}
                          value={outlet.outletUId}
                        />
                        <ListItemText primary={outlet.name} />
                      </ListItem>
                    ))}
                  </>
                )}
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
                    name="toDistributor"
                    placeholder="Distributor"
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
                    placeholder="Rep"
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
                    placeholder="Route"
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
              </Grid>
              <List
                style={{
                  marginTop: "16px",
                  border: "1px solid lightgrey",
                  height: "50%",
                  overflowY: "scroll",
                }}
              >
                {toOutletList.map((outlet) => (
                  <ListItem key={outlet.outletUId}>
                    <ListItemText primary={outlet.name} />
                  </ListItem>
                ))}
              </List>
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
                    variant="contained"
                    onClick={() => handleTransferOutlets(true)}
                    color="primary"
                    fullWidth
                    sx={{ mb: 1 }}
                    startIcon={<SendTimeExtensionRoundedIcon />}
                    disabled={!areRoutesSelected}
                  >
                    Transfer Outlets (Keep Existing)
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleTransferOutlets(false)}
                    color="primary"
                    fullWidth
                    startIcon={<SendRoundedIcon />}
                    disabled={!areRoutesSelected}
                  >
                    Transfer Outlets (Remove Existing)
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </FsBox>
  );
};

export default OutletTransfer;
