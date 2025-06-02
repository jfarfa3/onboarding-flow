export interface InputProps {
  field: FieldConfig;
  onInput: (name: string, value: string) => void;
  onBlur: (name: string, value: string) => void;
  onFocus: (name: string) => void;
}

export interface FieldConfig {
  type: "text" | "email" | "tel" | "password" | "date" | "select";
  label: string;
  name: string;
  id: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  regex?: string;
  validationMessage?: string;
  min?: number;
  max?: number;
  state?: "default" | "error" | "success";
  options?: Record<string, string>[];
  touched?: boolean;
}
