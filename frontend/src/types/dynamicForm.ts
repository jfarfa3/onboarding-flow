import type { FieldConfig } from "./input";

export interface DynamicFormProps {
  config: FieldConfig[][];
  onSubmit: (data: Record<string, string>) => void;
}
