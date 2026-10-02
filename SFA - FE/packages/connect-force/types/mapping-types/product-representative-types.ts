export interface ProdutsByRepresentativeId {
  productUId?: number;
  productID?: string;
  productName?: string;
  productGroup?: string;
  productCategory?: string;
  checkedStatus?: boolean;
}

export interface ProdutsByRepresentativeIdPagedResults {
  items?: Array<ProdutsByRepresentativeId> | null;
}
