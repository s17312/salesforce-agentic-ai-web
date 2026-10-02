export interface OutletsByRouteId{
    outletUId?: number;
    outletID?: string;
    outletName?: string;
    checkedStatus?: boolean;
};

export interface OutletsByRouteIdPagedResults{
    items?: Array<OutletsByRouteId> | null;
}