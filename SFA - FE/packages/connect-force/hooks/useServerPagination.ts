import { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';

export interface ServerPaginationParams {
  page: number; // 1-based index for Backend API
  pageSize: number;
  searchKeyword?: string;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UseServerPaginationOptions<T = any> {
  fetchData: (params: ServerPaginationParams) => Promise<{ data?: T[]; total?: number } | any> | void;
  defaultPageSize?: number;
  initialPageSize?: number;
  defaultSortColumn?: string;
  defaultSortOrder?: 'asc' | 'desc';
  defaultSort?: { field?: string; sort?: 'asc' | 'desc' };
  debounceMs?: number;
}

export function useServerPagination<T = any>({
  fetchData,
  defaultPageSize = 10,
  initialPageSize,
  defaultSortColumn = 'uId',
  defaultSortOrder = 'desc',
  defaultSort,
  debounceMs = 450,
}: UseServerPaginationOptions<T>) {
  const initialPageSizeVal = initialPageSize ?? defaultPageSize;
  const initialSortCol = defaultSort?.field ?? defaultSortColumn;
  const initialSortOrd = defaultSort?.sort ?? defaultSortOrder;

  // MUI DataGrid uses 0-based page index
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(initialPageSizeVal);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string>(initialSortCol);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrd);

  // Local state for results if returned from fetchData
  const [data, setData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Store latest fetchData ref
  const fetchDataRef = useRef(fetchData);
  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  const runFetch = useCallback(async (params: ServerPaginationParams) => {
    setLoading(true);
    try {
      const res = await fetchDataRef.current(params);
      if (res && typeof res === 'object') {
        if (Array.isArray(res.data)) {
          setData(res.data);
        }
        if (typeof res.total === 'number') {
          setTotalCount(res.total);
        } else if (typeof res.totalCount === 'number') {
          setTotalCount(res.totalCount);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search runner
  const debouncedFetchRef = useRef(
    debounce((params: ServerPaginationParams) => {
      runFetch(params);
    }, debounceMs)
  );

  // Direct fetch runner (for page, pageSize, and sort changes where debounce is not needed)
  const executeFetch = useCallback((params: ServerPaginationParams, isSearch: boolean = false) => {
    if (isSearch) {
      debouncedFetchRef.current(params);
    } else {
      debouncedFetchRef.current.cancel();
      runFetch(params);
    }
  }, [runFetch]);

  // Initial load
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      executeFetch({
        page: 1,
        pageSize: initialPageSizeVal,
        searchKeyword: undefined,
        sortColumn: initialSortCol,
        sortOrder: initialSortOrd,
      });
    }
  }, [initialPageSizeVal, initialSortCol, initialSortOrd, executeFetch]);

  // Handle Search Input Change
  const handleSearchChange = useCallback((value: string) => {
    const trimmed = value.trim();
    setSearchKeyword(trimmed);
    setPage(0); // Reset to page 0 (1st page) on new search

    executeFetch(
      {
        page: 1,
        pageSize,
        searchKeyword: trimmed || undefined,
        sortColumn,
        sortOrder,
      },
      true // use debounce for typing
    );
  }, [pageSize, sortColumn, sortOrder, executeFetch]);

  // Handle Pagination Model Change (Page & PageSize)
  const handlePaginationModelChange = useCallback((model: { page: number; pageSize: number }) => {
    setPage(model.page);
    setPageSize(model.pageSize);

    executeFetch({
      page: model.page + 1, // Convert 0-based to 1-based
      pageSize: model.pageSize,
      searchKeyword: searchKeyword || undefined,
      sortColumn,
      sortOrder,
    });
  }, [searchKeyword, sortColumn, sortOrder, executeFetch]);

  // Handle Sort Model Change
  const handleSortModelChange = useCallback((sortModel: any[]) => {
    let newCol = initialSortCol;
    let newOrd: 'asc' | 'desc' = initialSortOrd;

    if (sortModel && sortModel.length > 0) {
      newCol = sortModel[0].field;
      newOrd = sortModel[0].sort || 'asc';
    }

    setSortColumn(newCol);
    setSortOrder(newOrd);

    executeFetch({
      page: page + 1,
      pageSize,
      searchKeyword: searchKeyword || undefined,
      sortColumn: newCol,
      sortOrder: newOrd,
    });
  }, [page, pageSize, searchKeyword, initialSortCol, initialSortOrd, executeFetch]);

  // Refresh current query
  const refresh = useCallback(() => {
    executeFetch({
      page: page + 1,
      pageSize,
      searchKeyword: searchKeyword || undefined,
      sortColumn,
      sortOrder,
    });
  }, [page, pageSize, searchKeyword, sortColumn, sortOrder, executeFetch]);

  return {
    data,
    totalCount,
    loading,
    page,
    pageSize,
    searchKeyword,
    sortColumn,
    sortOrder,
    handleSearchChange,
    handlePaginationModelChange,
    handleSortModelChange,
    onSearchChange: handleSearchChange,
    onPaginationModelChange: handlePaginationModelChange,
    onSortModelChange: handleSortModelChange,
    refresh,
  };
}

export default useServerPagination;
