"use client";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import "./styles.css";
import styled from "styled-components";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { public_sanse } from "@/app/dashboard/font";
import ExpandOutlinedIcon from "@mui/icons-material/ExpandOutlined";
import CloseFullscreenOutlinedIcon from "@mui/icons-material/CloseFullscreenOutlined";
import ArrowIcon from "./feature-selection-sub-components/ArrowIcon";
import CheckBoxIcon from "./feature-selection-sub-components/CheckBoxIcon";
import SelectAllIcon from "@mui/icons-material/SelectAll"; // Add this import

const isParentNode = (id: any, tree: any) => {
  for (let node of tree) {
    if (node.id === id && node.children) {
      return true;
    }
  }
  return false;
};

const hasSelectedChildren = (id: any, selectedIds: any, tree: any) => {
  const node = tree.find((node: any) => node.id === id);
  if (node && node.children) {
    for (let child of node.children) {
      if (
        selectedIds.has(child.id) ||
        hasSelectedChildren(child.id, selectedIds, tree)
      ) {
        return true;
      }
    }
  }
  return false;
};

const getChildNodes = (selectedIds: any, tree: any[], userRoleId: any) => {
  const selectedArray = Array.from(selectedIds) as string[]; // Explicitly cast to string[]
  return selectedArray
    .filter((id: string) =>
      !isParentNode(id, tree) || !hasSelectedChildren(id, selectedIds, tree)
    )
    .map((id: string) => {
      const segments = id.split("-");
      return {
        roleUId: Number(userRoleId),
        moduleUId: parseInt(segments[1], 10),
        mainMenuUId: parseInt(segments[2], 10),
        subMenuUId: parseInt(segments[3], 10),
        subMenuPermissionUId: parseInt(segments[4], 10),
        isActive: true,
      };
    });
};

const FeatureSelection = forwardRef(({ userRoleId, onSelectionChange, onClear, features, initialSelectedIds = [] }: any, ref: any) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedFeaturesIds, setSelectedFeaturesIds] = useState<any[]>([]);
  const [expandedIds, setExpandedIds] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [uniqueTree, setUniqueTree] = useState<any>(null); // Store the unique tree

  const hasTriggered = useRef(false);

  const generateUniqueIds = (node: any, parentId: string = "") => {
    const nodeId = node.id || "unknown";
    const uniqueId = parentId ? `${parentId}-${nodeId}` : `${nodeId}`;

    return {
      ...node,
      id: uniqueId,
      children: node.children
        ? node.children.map((child: any) => generateUniqueIds(child, uniqueId))
        : [],
    };
  };

  useEffect(() => {
    if (!hasTriggered.current && features?.children) {
      hasTriggered.current = true; // Prevent future executions

      const uniqueFeatures = generateUniqueIds(features);
      setUniqueTree(uniqueFeatures); // Save the unique tree

      const flattenedData = flattenTree(uniqueFeatures);
      setData(flattenedData);

      const validIds = initialSelectedIds.filter((id: any) =>
        flattenedData.some((node) => node.id === id)
      );

      setSelectedIds(validIds);
      setSelectedFeaturesIds(validIds);
    }
  }, [features, initialSelectedIds]);

  const getAllLeafNodeIds = (nodes: any[]): string[] => {
    let ids: string[] = [];
    nodes.forEach((node) => {
      if (!node.children || node.children.length === 0) {
        ids.push(node.id);
      } else {
        ids = ids.concat(getAllLeafNodeIds(node.children));
      }
    });
    return ids;
  };

  // Handler for Select All
  const handleSelectAll = () => {
    if (!uniqueTree) return;
    // Use the unique tree for leaf node extraction
    const allLeafIds = getAllLeafNodeIds(uniqueTree.children || []);
    setSelectedIds(allLeafIds);
    const childNodes = getChildNodes(new Set(allLeafIds), uniqueTree.children, userRoleId);
    setSelectedFeaturesIds(childNodes);
    onSelectionChange(childNodes);
  };

  const handleChange = (props: any) => {
    const childNodes = getChildNodes(props.treeState.selectedIds, features.children, userRoleId);
    setSelectedFeaturesIds(childNodes);
    onSelectionChange(childNodes);
  };

  const handleExpandAll = () => {
    const allNodeIds = data.map((node) => node.id);
    setExpandedIds(allNodeIds);
  };

  const handleCollapseAll = () => {
    setExpandedIds([]);
  };

  useImperativeHandle(ref, () => ({
    clearSelection: () => {
      if (selectedIds.length > 0) {
        onSelectionChange([]);
      }
      setSelectedIds([]);
      setSelectedFeaturesIds([]);
      onClear();
    },
  }));

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AroundContainer className={`${public_sanse.className}`}>
        <ActionButtonContainer>
          <Tooltip title="Clear Selection">
            <IconButton onClick={() => ref.current.clearSelection()}>
              <DeleteOutlineOutlinedIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Select All">
            <IconButton onClick={handleSelectAll}>
              <SelectAllIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Expand All">
            <IconButton onClick={handleExpandAll}>
              <ExpandOutlinedIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Collapse All">
            <IconButton onClick={handleCollapseAll}>
              <CloseFullscreenOutlinedIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Tooltip>
        </ActionButtonContainer>
        <div
          className="checkbox"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            overflowY: "auto",
          }}
        >
          <TreeContainer>
            <TreeView
              data={data}
              className="checkbox-tree"
              aria-label="Checkbox tree"
              multiSelect
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              propagateSelect
              propagateSelectUpwards
              togglableSelect
              onSelect={(props) => ""}
              onNodeSelect={handleChange}
              nodeRenderer={(props) => {
                const {
                  element,
                  isBranch,
                  isExpanded,
                  isSelected,
                  isHalfSelected,
                  isDisabled,
                  getNodeProps,
                  level,
                  handleSelect,
                  handleExpand,
                } = props;

                return (
                  <div
                    {...getNodeProps({ onClick: handleExpand })}
                    style={{
                      marginLeft: 50 * (level - 1),
                      opacity: isDisabled ? 0.5 : 1,
                      marginBottom: "20px",
                    }}
                  >
                    {isBranch && <ArrowIcon isOpen={isExpanded} />}
                    <CheckBoxIcon
                      className="checkbox-icon"
                      onClick={(e) => {
                        handleSelect(e);
                        e.stopPropagation();
                      }}
                      variant={
                        isHalfSelected ? "some" : isSelected ? "all" : "none"
                      }
                    />
                    <span className="name">{element.name}</span>
                  </div>
                );
              }}
            />
          </TreeContainer>
        </div>
      </AroundContainer>
    </>
  );
});
FeatureSelection.displayName = "FeatureSelection";

export default FeatureSelection;

//styles
const ActionButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 0 0 0.5rem 0;
`;

const AroundContainer = styled.div`
  padding-left: 45px;
`;

const TreeContainer = styled.div`
  min-height: 100%;
  overflow: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;