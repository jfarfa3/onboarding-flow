export interface DynamicColumns<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

export interface DynamicTableProps<T> {
  data: T[];
  columns: DynamicColumns<T>[];
  actions?: (item: T) => React.ReactNode;
}
