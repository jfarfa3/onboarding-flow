export interface DynamicColumns<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  type?: "text" | "select" | "checkbox" | "email" | "multi-select" | "hidden";
  key?: string;
  options?: Record<string, string>[];
  extractor?: (item: T) => string | string[] | boolean;
  editable?: boolean;
  toCreate?: boolean;
}

export interface DynamicTableProps<T> {
  data: T[];
  columns: DynamicColumns<T>[];
  actions?: (item: T) => React.ReactNode;
}
