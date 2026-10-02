export interface RoutesByRepresentativeId {
  routeUId?: number;
  routeId?: string;
  routeName?: string;
  startPoint?: string;
  endPoint?: string;
  checkedStatus?: boolean;
}

export interface RoutesByRepresentativeIdPagedResults {
  items?: Array<RoutesByRepresentativeId> | null;
}
