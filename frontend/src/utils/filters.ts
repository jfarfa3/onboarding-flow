export function filterAndSort<T>(
  data: T[],
  sortBy: keyof T | string, // Acepta string para rutas anidadas
  direction: "asc" | "desc" = "asc",
  filterText: string,
): T[] {
  let filteredData = data;

  if (filterText && filterText.trim() !== "") {
    const lowerFilter = filterText.toLowerCase();
    filteredData = filteredData.filter((item) => {
      const value = getNestedValue(item, sortBy as string);
      return value !== undefined && String(value).toLowerCase().includes(lowerFilter);
    });
  }

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = getNestedValue(a, sortBy as string);
    const bValue = getNestedValue(b, sortBy as string);

    if (aValue == null || bValue == null) return 0;

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (aStr < bStr) return direction === "asc" ? -1 : 1;
    if (aStr > bStr) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return sortedData;
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((o, p) => {
    if (o && typeof o === 'object' && p in o) {
      return (o as { [key: string]: unknown })[p];
    }
    return undefined;
  }, obj);
}
