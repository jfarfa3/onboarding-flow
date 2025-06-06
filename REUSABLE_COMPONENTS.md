# 🧩 Componentes Reutilizables

Este documento describe los componentes reutilizables que se incluyen en el template y cómo usarlos en tus proyectos.

## Componentes Incluidos

### 📊 Tablas Dinámicas

#### `DynamicTable`
Un componente para mostrar datos tabulados con capacidad de ordenación por columnas.

**Ubicación:** `src/components/molecules/DynamicTable.tsx`

**Características:**
- Ordenación por columnas
- Renderizado condicional de celdas
- Soporte para acciones personalizadas por fila
- Estilos configurables por columna

**Ejemplo de uso:**

```tsx
import DynamicTable from "../components/molecules/DynamicTable";

// Datos de ejemplo
const data = [
  { id: 1, name: "Elemento 1", status: "Activo" },
  { id: 2, name: "Elemento 2", status: "Inactivo" },
];

// Definición de columnas
const columns = [
  { header: "ID", accessor: "id" },
  { header: "Nombre", accessor: "name" },
  { header: "Estado", accessor: "status" },
];

// Renderizado
<DynamicTable 
  data={data} 
  columns={columns} 
  actions={(item) => (
    <button onClick={() => handleItemClick(item)}>
      Ver
    </button>
  )}
/>
```

#### `DynamicFilterTable`
Una extensión de DynamicTable que incluye capacidades de filtrado avanzado.

**Ubicación:** `src/components/organism/DynamicFilterTable.tsx`

**Características:**
- Todas las características de DynamicTable
- Filtrado por texto en todas las columnas
- Filtros adicionales configurables
- Capacidades de creación y edición de registros

**Ejemplo de uso:**

```tsx
import DynamicFilterTable from "../components/organism/DynamicFilterTable";

<DynamicFilterTable 
  baseRequests={data}
  columns={columns}
  filterOptions={[
    {
      type: "select",
      name: "status",
      label: "Estado",
      id: "status-filter",
      options: [
        { value: "active", label: "Activo" },
        { value: "inactive", label: "Inactivo" },
      ]
    }
  ]}
  defaultSortBy="name"
  actions={(item) => (
    <button onClick={() => handleItemView(item)}>Ver</button>
  )}
  onSave={handleSaveItem}
  onEdit={handleEditItem}
  allowAddNew={true}
  allowEdit={true}
/>
```

### 📝 Formularios Dinámicos

#### `DynamicForm`
Un componente para crear formularios basados en configuración.

**Ubicación:** `src/components/molecules/DynamicForm.tsx`

**Características:**
- Generación de formularios basada en configuración
- Validación de campos
- Mensajes de error personalizables
- Soporte para diferentes tipos de campos

**Ejemplo de uso:**

```tsx
import DynamicForm from "../components/molecules/DynamicForm";

const formConfig = [
  [
    {
      type: "text",
      label: "Nombre",
      name: "name",
      id: "name",
      required: true,
    },
    {
      type: "email",
      label: "Email",
      name: "email",
      id: "email",
      required: true,
    }
  ],
  [
    {
      type: "select",
      label: "Rol",
      name: "role",
      id: "role",
      options: [
        { value: "admin", label: "Administrador" },
        { value: "user", label: "Usuario" }
      ]
    }
  ]
];

<DynamicForm 
  config={formConfig} 
  onSubmit={(data) => console.log(data)} 
/>
```

#### `DynamicFilterForm`
Un componente para crear formularios de filtrado.

**Ubicación:** `src/components/molecules/DynamicFilterForm.tsx`

**Características:**
- Optimizado para filtros
- Aplicación de filtros en tiempo real
- Diseño compacto

### 📈 Tarjetas de Estadísticas

#### `StatCard`
Un componente para mostrar estadísticas con gráficos.

**Ubicación:** `src/components/molecules/StatCard.tsx`

**Características:**
- Visualización de valores estadísticos con iconos
- Indicador de tendencias (porcentaje de cambio)
- Gráfico de línea para mostrar tendencias
- Estilos personalizables

**Ejemplo de uso:**

```tsx
import StatCard from "../components/molecules/StatCard";
import { Users, ArrowUp } from "lucide-react";

const chartData = [
  { value: 10 },
  { value: 15 },
  { value: 20 },
  // ...más puntos de datos
];

<StatCard 
  title="Total de Usuarios" 
  value="1,234" 
  icon={<Users className="opacity-20 text-blue-500" />}
  percentageChange="+5.3%" 
  trendIcon={<ArrowUp className="text-green-500" />}
  chartData={chartData}
  chartColor="#3b82f6"
  className="bg-white shadow-md"
/>
```

## Tipos definidos

Para garantizar el funcionamiento correcto de estos componentes, se incluyen los siguientes tipos:

- `DynamicTableProps` y `DynamicColumns` en `src/types/dynamicTable.ts`
- `DynamicFormProps` en `src/types/dynamicForm.ts`
- `FieldConfig` y `InputProps` en `src/types/input.ts`
- `StatCardProps` en los propios componentes

## Utilidades incluidas

- `filterAndSort`: Función para filtrar y ordenar listas de objetos (`src/utils/filters.ts`)
- `showToast`: Función para mostrar notificaciones toast (`src/utils/toast.ts`)

## Consejos para personalización

Estos componentes están diseñados para ser altamente personalizables:

1. **Estilos**: Puedes modificar los estilos usando las props `className` o editando directamente las clases de Tailwind en los componentes.

2. **Comportamiento**: Cada componente acepta callbacks como `onSubmit`, `onSave`, `onEdit` para personalizar el comportamiento.

3. **Extensión**: Puedes extender estos componentes creando wrappers específicos para tu aplicación que añadan funcionalidad adicional.
