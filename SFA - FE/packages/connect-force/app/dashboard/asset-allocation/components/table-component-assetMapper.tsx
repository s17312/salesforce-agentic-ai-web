"use client";

export const AssetMapperTableHeadings = [
    {
        field: "assetID",
        headerName: "Asset ID",
        flex: 1,
        disableColumnMenu: true,
        minWidth: 100,
        valueGetter: (params: any) => params.row.assetId || "-",
    },
    {
        field: "assetName",
        headerName: "Asset Name",
        flex: 1,
        disableColumnMenu: true,
        minWidth: 100,
        valueGetter: (params: any) => params.row.assetName || "-",
    },
    {
        field: "assetTypeName",
        headerName: "Asset Type",
        flex: 1,
        disableColumnMenu: true,
        minWidth: 100,
        valueGetter: (params: any) => params.row.assetType?.assetTypeName || "-",
    },
    {
        field: "assetBrandName",
        headerName: "Asset Brand",
        flex: 1,
        disableColumnMenu: true,
        minWidth: 100,
        valueGetter: (params: any) => params.row.assetBrand?.assetBrandName || "-",
    },
    {
        field: "assetModelName",
        headerName: "Asset Model",
        flex: 1,
        disableColumnMenu: true,
        minWidth: 100,
        valueGetter: (params: any) => params.row.assetModel?.assetModelName || "-",
    },
    {
        field: "serialNumber",
        headerName: "Serial Number",
        flex: 1,
        disableColumnMenu: true,
        minWidth: 100,
        valueGetter: (params: any) => params.row.serialNumber || "-",
    }
];

export const tableOptions = {
    rowsPerPageOptions: [5, 10, 15, 100],
};