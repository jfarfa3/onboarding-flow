import type { DynamicColumns } from "@/types/dynamicTable";
import type { FieldConfig } from "@/types/input";
import { filterAndSort } from "@/utils/filters";
import { useEffect, useState } from "react";
import DynamicFilterForm from "../molecules/DynamicFilterForm";
import DynamicTable from "../molecules/DynamicTable";
import { Save, X } from 'lucide-react';

interface DynamicFilterTableProps<T> {
  baseRequests: T[];
  columns: DynamicColumns<T>[];
  filterOptions?: FieldConfig[]; // Pasamos un array plano, más flexible
  defaultSortBy: string;
  actions?: (item: T) => React.ReactNode;
  onSave?: (newItem: T) => Promise<void>;
  allowAddNew?: boolean;
}

export default function DynamicFilterTable<T>({
  baseRequests,
  columns,
  filterOptions,
  defaultSortBy,
  actions,
  onSave,
  allowAddNew = false,
}: DynamicFilterTableProps<T>) {
  const [requests, setRequests] = useState<T[]>(baseRequests);
  const [sortBy, setSortBy] = useState<string>(defaultSortBy);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [filterText, setFilterText] = useState<string>("");

  const [newRecord, setNewRecord] = useState<Partial<T> | null>(null);

  const handleAddClick = () => {
    const emptyRecord: Partial<T> = {};
    columns.forEach(col => {
      (emptyRecord as any)[col.key] = col.type === "multi-select" ? [] : "";
    });
    setNewRecord(emptyRecord);
  };

  const handleInputChange = (
    key: string,
    value: string | string[] | boolean,
    type?: string
  ) => {
    if (!newRecord) return;

    if (type === "multi-select" && Array.isArray(value)) {
      setNewRecord((prev) => ({
        ...prev,
        [key]: value,
      }));
    } else {
      setNewRecord((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleSave = async () => {
    if (!newRecord) return;
    try {
      if (onSave) {
        await onSave(newRecord as T);
      }
      setNewRecord(null);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  useEffect(() => {
    const sortedFiltered = filterAndSort(baseRequests, sortBy, order, filterText);
    setRequests([...sortedFiltered]);
  }, [baseRequests, sortBy, order, filterText]);

  const updatedFilterOptions = filterOptions?.map((field) => ({
    ...field,
    value:
      field.name === "sortBy"
        ? sortBy
        : field.name === "order"
          ? order
          : field.name === "filterText"
            ? filterText
            : field.value || "",
  })) || [];

  return (
    <div className="flex flex-col w-full text-black">
      {
        filterOptions && filterOptions.length > 0 && (
          <DynamicFilterForm
            config={[updatedFilterOptions]}
            onFilterChange={(name, value) => {
              if (name === "sortBy") setSortBy(value);
              else if (name === "order") setOrder(value as "asc" | "desc");
              else if (name === "filterText") setFilterText(value);
            }}
          />
        )
      }
      {allowAddNew && (
        <div className="flex justify-end mb-4">
          {!newRecord && (
            <button
              onClick={handleAddClick}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              + Agregar nuevo
            </button>
          )}
        </div>
      )}
      {newRecord && (
        <div className="w-full overflow-x-auto mb-4 text-black">
          <div className="flex gap-2 w-full flex-row">
            {columns
              .filter(col => col.key)
              .map(col => (
                <div key={col.key || col.header} className="flex flex-col w-full justify-center items-center">
                  <label className="text-sm">{col.header}</label>
                  {col.type === "multi-select" && col.options ? (
                    <select
                      multiple
                      value={(newRecord as any)[col.key] || []}
                      onChange={(e) => {
                        const selectedValues = Array.from(e.target.selectedOptions).map((option) => option.value);
                        handleInputChange(col.key, selectedValues, col.type);
                      }}
                      className="border border-gray-300 rounded w-full p-2"
                    >
                      {col.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : col.type === "select" && col.options ? (
                    <select
                      value={(newRecord as any)[col.key] || ""}
                      onChange={(e) => handleInputChange(col.key, e.target.value)}
                      className="border border-gray-300 rounded w-full p-2"
                    >
                      <option value="">Seleccione...</option>
                      {col.options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : col.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={Boolean((newRecord as any)[col.key])}
                      onChange={(e) => handleInputChange(col.key, e.target.checked)}
                      className="border border-gray-300 rounded w-5 h-5 p-2"
                    />
                  ) : (
                    <input
                      type={col.type || "text"}
                      value={(newRecord as any)[col.key] || ""}
                      onChange={(e) => handleInputChange(col.key, e.target.value)}
                      className="border border-gray-300 rounded w-full p-2"
                    />
                  )}
                </div>
              ))}
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white p-2 h-fit w-fit rounded hover:bg-blue-600"
              >
                <Save className="inline" />
              </button>
              <button
                onClick={() => setNewRecord(null)}
                className="bg-gray-300 text-black p-2 h-fit w-fit rounded hover:bg-gray-400"
              >
                <X className="inline" />
              </button>
            </div>
          </div>
        </div>
      )}
      <DynamicTable data={requests} columns={columns} actions={actions} />
    </div>
  );
}