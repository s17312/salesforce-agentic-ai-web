export interface RoutesByDistributorId {
  routeUId?: number;
  routeID?: string;
  routeName?: string;
  checkedStatus?: boolean;
}

export interface RoutesByDistributorIdPagedResults {
  items?: Array<RoutesByDistributorId> | null;
}
