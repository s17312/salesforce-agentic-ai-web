"use client";
import FormProvider from "@/components/hook-form/FormProvider";
import { ERROR_MSG, SUCCESS_MSG } from "@/data/commons";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { Container, cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { LoadingButton } from "@mui/lab";
import { Accordion, AccordionSummary, Box, Button, Card, CircularProgress, Grid, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import FeatureSelection from "./featureSelection";
import styled from "styled-components";
import { PATH_DASHBOARD } from "@/routes/paths";
import { createUserRolePermission, getAllUserRolePermissionDetailsByRole } from "@/service/user-management/userRolePermission.service";
import { enqueueSnackbar } from "notistack";
import { setUserRolePermissionModules } from "@/redux/slices/user-management/user-role-permission-slice";

type Permission = {
  id: string;
  permission: string;
}

type FeaturePermission = {
  name: string;
  permissions: Permission[];
}

type Feature = {
  clientId: string;
  featurePermissions: FeaturePermission[];
}

type Role = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  features: Feature[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  roles: Role[];
}

const CreateUserRole = (params: { userRoleId: any }) => {
  const defaultValues = {
    name: "",
    description: "",
  };
  const methods = useForm<any>({
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, control } = methods;
  const router = useRouter();
  const errorMsg = "Error message";
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [responseMessage, setResponseMessage] = useState<string | any>("");
  const [responseType, setResponseType] = useState<string>("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const featureSelectionRef = useRef<any>(null);
  const [features, setFeatures] = useState<any>(null);
  const [initialSelectedIds, setInitialSelectedIds] = useState<string[]>([]);
  const rolePermission = useSelector((state) => state.userRolePermissionSlice.userRolePermissionModules);
  const setUserRoleData = useSelector((state) => state.userRolePermissionSlice.userRoleData);

  useEffect(() => {
    dispatch(setUserRolePermissionModules([]));
    setInitialSelectedIds([]);
    setFeatures(null);
    const fetchData = async () => {
      try {
        await getAllUserRolePermissionDetailsByRole(params.userRoleId);
      } catch (error) {
        enqueueSnackbar(`Something went wrong`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (rolePermission !== null) {
      setInitialSelectedIds(extractGrantedIds({ name: "Root", children: features }));
      const transformedFeatures = transformPayload(rolePermission);
      const updatedFeatures = transformedFeatures.map((feature) => {
        const existingFeature = features?.find((f: any) => f.id === feature.id);
        if (existingFeature) {
          return {
            ...feature,
            children: feature.children.map((child: any) => {
              const existingChild = existingFeature.children.find(
                (c: any) => c.id === child.id
              );
              return existingChild ? { ...child, ...existingChild } : child;
            }),
          };
        }
        return feature;
      });
      setFeatures(updatedFeatures);
    } else {
      setFeatures(null);
    }
  }, [rolePermission]);

  useEffect(() => {
    if (errorMsg && errorMsg !== responseMessage) {
      setResponseMessage(errorMsg);
      setResponseType(ERROR_MSG);
    }
  }, [errorMsg, responseMessage]);

  const createPayloadFromSelectedIds = (selectedIds: any[]) => {
    return selectedIds
      .filter((item) => !Number.isNaN(item.subMenuPermissionUId)) // Remove objects with NaN subMenuPermissionUId
      .map((item) => ({
        roleUId: Number(item.roleUId),
        moduleUId: item.moduleUId,
        mainMenuUId: item.mainMenuUId,
        subMenuUId: item.subMenuUId,
        subMenuPermissionUId: item.subMenuPermissionUId,
        isActive: item.isActive,
      }));
  };

  // Helper to generate the unique key for a selectedId object
  const getSelectedIdKey = (item: any) =>
    `unknown-${item.moduleUId}-${item.mainMenuUId}-${item.subMenuUId}-${item.subMenuPermissionUId}`;

  // Call this function before creating the payload
  const mergeDeselectedIds = (selectedIds: any[], initialSelectedIds: string[]) => {
    const selectedIdKeys = selectedIds.map(getSelectedIdKey);
    const deselected = initialSelectedIds
      .filter((id) => !selectedIdKeys.includes(id))
      .map((id) => {
        // Parse the id to extract the UIDs
        const [, moduleUId, mainMenuUId, subMenuUId, subMenuPermissionUId] = id.split("-");
        return {
          roleUId: Number(params.userRoleId),
          moduleUId: Number(moduleUId),
          mainMenuUId: Number(mainMenuUId),
          subMenuUId: Number(subMenuUId),
          subMenuPermissionUId: Number(subMenuPermissionUId),
          isActive: false,
        };
      });
    return [...selectedIds, ...deselected];
  };

  // In handleCreateUserRole, use this before creating the payload:
  const handleCreateUserRole = async (data: any) => {
    if (selectedIds.length === 0 && initialSelectedIds.length === 0) {
      setResponseMessage("Please select at least one permission.");
      setResponseType(ERROR_MSG);
      dispatch(setPopupResponse(true));
      return;
    }

    // Merge deselected
    const mergedIds = mergeDeselectedIds(selectedIds, initialSelectedIds);
    const payload = createPayloadFromSelectedIds(mergedIds);

    try {
      const res = await createUserRolePermission(payload)
      enqueueSnackbar(res.result.message, { variant: "success" });
      setResponseMessage(res.result.message);
      router.push(PATH_DASHBOARD.userRolePermission.list);
    } catch (error) { }
  };

  const handleSelectionChange = (selectedFeaturesIds: any) => {
    // Merge deselected for previewing the final payload
    const mergedIds = mergeDeselectedIds(selectedFeaturesIds, initialSelectedIds);
    const payload = createPayloadFromSelectedIds(mergedIds);

    setIsSubmitEnabled(payload.length > 0);
    setSelectedIds(selectedFeaturesIds);
  };

  const handleClearSelection = () => {
    if (initialSelectedIds.length > 0) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
    setSelectedIds([]);
  };

  const transformPayload = useCallback((payload: any[]) => {
    return payload.map((module) => ({
      id: module.moduleUId,
      name: module.moduleName,
      children: module.menus.map((menu: any) => ({
        id: menu.menuUId,
        name: menu.menuName,
        children: menu.subMenus.map((subMenu: any) => ({
          id: subMenu.subMenuUId,
          name: subMenu.subMenuName,
          children: subMenu.permissions.map((permission: any) => ({
            id: permission.menuPermissionUId,
            name: permission.menuPermissionName,
            isGranted: permission.permission,
          })),
        })),
      })),
    }));
  }, []);

  const extractGrantedIds = (node: any, parentId: string = ""): string[] => {
    if (!node) {
      return []; // Return an empty array if the node is null or undefined
    }

    const nodeId = node.id || "unknown";
    const uniqueId = parentId ? `${parentId}-${nodeId}` : `${nodeId}`;
    let grantedIds: string[] = [];

    if (node.isGranted) {
      grantedIds.push(uniqueId);
    }

    if (node.children) {
      node.children.forEach((child: any) => {
        grantedIds = grantedIds.concat(extractGrantedIds(child, uniqueId));
      });
    }

    return grantedIds;
  };

  if (features == null || features == undefined || features.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="48vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container>
      <Accordion
        expanded={true}
        sx={{
          mb: 2,
          border: "1px solid #BDC1E4",
          borderRadius: "9px",
        }}
      >
        <AccordionSummary
          aria-controls="Asset Brand Creation"
          id="panel1a-header"
          sx={cursorDefault}
        >
          <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
            Select Permissions
          </Typography>
        </AccordionSummary>
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(handleCreateUserRole)}
        >
          {rolePermission === null ? (
            <AroundContainer>
              <Card>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="48vh"
                >
                  <CircularProgress />
                </Box>
              </Card>
            </AroundContainer>
          ) : (
            rolePermission &&
            <FeatureSelection
              key={initialSelectedIds.join(",")}
              userRoleId={params.userRoleId}
              ref={featureSelectionRef}
              onSelectionChange={handleSelectionChange}
              onClear={handleClearSelection}
              features={{ name: "Root", children: features }}
              initialSelectedIds={initialSelectedIds}
            />
          )}
          <Box
            sx={{ mr: 3, mb: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              type="reset"
              variant="outlined"
              onClick={() => {
                reset(defaultValues),
                  featureSelectionRef?.current.clearSelection();
              }}
            >
              Clear
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={formState.isSubmitting}
              disabled={!formState.isDirty && !isSubmitEnabled}
            >
              {initialSelectedIds.length > 0 ? "Update" : "Create"}
            </LoadingButton>
          </Box>
        </FormProvider>
      </Accordion>
    </Container>
  );
};

export default CreateUserRole;

const AroundContainer = styled.div`
  display: grid;
  gap: 2%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;