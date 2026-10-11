/**
 * Table, DataGrid, Pagination, Empty State, and Skeleton Constants
 * Authoritative Single Source of Truth (SSOT) across connect-force
 */

// ==========================================
// Dimensions & Layout
// ==========================================
export const TABLE_CONTAINER_MIN_HEIGHT = 400;
export const TABLE_VIRTUAL_SCROLLER_MIN_HEIGHT = 340;
export const TABLE_OVERLAY_MIN_HEIGHT = 340;
export const TABLE_HEADER_MIN_HEIGHT = 48;
export const TABLE_HEADER_MAX_HEIGHT = 48;
export const TABLE_ROW_HEIGHT = 52;

// ==========================================
// Pagination & Query Defaults
// ==========================================
export const DEFAULT_PAGE_INDEX = 0; // 0-indexed for MUI DataGrid
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
export const DEFAULT_SORT_COLUMN = "uId";
export const DEFAULT_SORT_ORDER: "asc" | "desc" = "desc";
export const DEFAULT_SEARCH_DEBOUNCE_MS = 450;

export const DEFAULT_SORT_CONFIG: { field: string; sort: "asc" | "desc" } = {
  field: DEFAULT_SORT_COLUMN,
  sort: DEFAULT_SORT_ORDER,
};

export const DEFAULT_PAGINATION_CONFIG = {
  defaultPageSize: DEFAULT_PAGE_SIZE,
  initialPageSize: DEFAULT_PAGE_SIZE,
  defaultSortColumn: DEFAULT_SORT_COLUMN,
  defaultSortOrder: DEFAULT_SORT_ORDER,
  defaultSort: DEFAULT_SORT_CONFIG,
  debounceMs: DEFAULT_SEARCH_DEBOUNCE_MS,
} as const;

export const DEFAULT_TABLE_OPTIONS = {
  rowsPerPageOptions: DEFAULT_ROWS_PER_PAGE_OPTIONS,
} as const;

// ==========================================
// Empty State (No Rows) Constants
// ==========================================
export const EMPTY_STATE_TITLE = "No data to display";
export const EMPTY_STATE_SUBTITLE = "There are no records in this table yet.";
export const EMPTY_STATE_ICON = "table_chart";
export const EMPTY_STATE_ICON_SIZE = 28;
export const EMPTY_STATE_ICON_BOX_SIZE = 52;
export const EMPTY_STATE_DEFAULT_BUTTON_TEXT = "Add Entry";

// ==========================================
// Skeleton Loader Constants
// ==========================================
export const SKELETON_DEFAULT_ROW_COUNT = 7;
export const SKELETON_DEFAULT_COLUMN_COUNT = 6;
export const SKELETON_ROW_HEIGHT = 52;
export const SKELETON_CELL_HEIGHT = 18;
export const SKELETON_ACTION_ICON_SIZE = 24;
export const SKELETON_WIDTH_VARIATIONS = [65, 80, 50, 75, 45, 85, 60];

// ==========================================
// Fallback Theme Colors & Palette Constants
// ==========================================
export const TABLE_FALLBACK_THEME = {
  primaryMain: "#6366f1",
  primaryDark: "#4f46e5",
  headerTint: "#ede9fe",
  textPrimary: "#0f172a",
  textSecondary: "#686d94",
  borderSubtle: "rgba(0, 0, 0, 0.08)",
  rowHover: "#f8fafc",
  emptyIconBoxBg: "#f4f5f8",
} as const;

export const ACTION_ICON_COLORS = {
  view: "#00B8D9",
  edit: "#7D56EC",
  delete: "#FF5630",
} as const;
