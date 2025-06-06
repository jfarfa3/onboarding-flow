#!/bin/bash

# Función para crear utilitarios necesarios para los componentes
create_utils_files() {
    local target_dir=$1

    # Crear directorio de utilidades
    mkdir -p "$target_dir/frontend/src/utils"
    
    # Utilitario de filtrado para la tabla dinámica
    echo '
export function filterAndSort<T>(
  data: T[],
  sortBy: keyof T | string,
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
  return path.split(".").reduce((o, p) => {
    if (o && typeof o === "object" && p in o) {
      return (o as { [key: string]: unknown })[p];
    }
    return undefined;
  }, obj);
}

' > "$target_dir/frontend/src/utils/filters.ts"

    # Utilitario para notificaciones
    echo '
import { toast, type ToastOptions } from "react-toastify";

const toastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export function showErrorToast(message: string, id: string) {
  toast.error(message, {
    ...toastOptions,
    toastId: id,
  });
}

export function showSuccessToast(message: string, id: string) {
  toast.success(message, {
    ...toastOptions,
    toastId: id,
  })
}

export function showInfoToast(message: string, id: string) {
  toast.info(message, {
    ...toastOptions,
    toastId: id,
  });
}
' > "$target_dir/frontend/src/utils/toast.ts"
}
