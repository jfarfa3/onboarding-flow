import type { DynamicTableProps } from "@/types/dynamicTable";
import React, { useState, useMemo } from "react";

export default function DynamicTable<T>({
  data,
  columns,
  actions
}: DynamicTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc' | null;
  }>({ key: null, direction: null });

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;
    const sorted = [...data];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === undefined || bValue === undefined) return 0;

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const handleSort = (accessor: keyof T | ((item: T) => React.ReactNode)) => {
    if (typeof accessor !== "string") return;
    if (sortConfig.key === accessor) {
      const direction =
        sortConfig.direction === 'asc'
          ? 'desc'
          : sortConfig.direction === 'desc'
            ? null
            : 'asc';
      setSortConfig({ key: direction ? accessor : null, direction });
    } else {
      setSortConfig({ key: accessor, direction: 'asc' });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-6 py-3 cursor-pointer select-none ${col.className || ""
                  }`}
                onClick={() => handleSort(col.accessor)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {typeof col.accessor === "string" && sortConfig.key === col.accessor && (
                    <span>
                      {sortConfig.direction === "asc"
                        ? "▲"
                        : sortConfig.direction === "desc"
                          ? "▼"
                          : ""}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {actions && <th className="px-6 py-3">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, rowIdx) => (
            <tr
              key={rowIdx}
              className="border-b hover:bg-gray-50 transition duration-200"
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={`px-6 py-4 ${col.className || ""}`}>
                  {typeof col.accessor === "function"
                    ? col.accessor(item)
                    : String(item[col.accessor])}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
