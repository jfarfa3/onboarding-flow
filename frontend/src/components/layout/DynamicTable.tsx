import type { DynamicColumns } from "@/types/dynamicTable";
import type { FieldConfig } from "@/types/input";
import { filterAndSort } from "@/utils/filters";
import { useEffect, useState } from "react";
import DynamicFilterForm from "../molecules/DynamicFilterForm";
import DynamicTable from "../molecules/DynamicTable";

interface DynamicPendingTableProps<T> {
  baseRequests: T[];
  columns: DynamicColumns<T>[];
  filterOptions: FieldConfig[]; // Pasamos un array plano, más flexible
  defaultSortBy: string;
  actions?: (item: T) => React.ReactNode;
}

export default function DynamicPendingTable<T>({
  baseRequests,
  columns,
  filterOptions,
  defaultSortBy,
  actions,
}: DynamicPendingTableProps<T>) {
  const [requests, setRequests] = useState<T[]>(baseRequests);
  const [sortBy, setSortBy] = useState<string>(defaultSortBy);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [filterText, setFilterText] = useState<string>("");

  useEffect(() => {
    const sortedFiltered = filterAndSort(baseRequests, sortBy, order, filterText);
    setRequests([...sortedFiltered]);
  }, [baseRequests, sortBy, order, filterText]);

  const updatedFilterOptions = filterOptions.map((field) => ({
    ...field,
    value:
      field.name === "sortBy"
        ? sortBy
        : field.name === "order"
          ? order
          : field.name === "filterText"
            ? filterText
            : field.value || "",
  }));
  return (
        <>
      <DynamicFilterForm
        config={[updatedFilterOptions]}
        onFilterChange={(name, value) => {
          if (name === "sortBy") setSortBy(value);
          else if (name === "order") setOrder(value as "asc" | "desc");
          else if (name === "filterText") setFilterText(value);
        }}
      />
      <DynamicTable data={requests} columns={columns} actions={actions} />
    </>
  )
}