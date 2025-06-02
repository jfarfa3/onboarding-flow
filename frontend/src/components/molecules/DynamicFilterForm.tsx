import { useState } from "react";
import type { FieldConfig } from "@/types/input";
import Input from "../atoms/Input";

interface DynamicFilterFormProps {
  config: FieldConfig[][];
  onFilterChange: (name: string, value: string) => void;
}

export default function DynamicFilterForm({
  config,
  onFilterChange
}: DynamicFilterFormProps) {
  const initialFormState: Record<string, string> = {};
  config.flat().forEach((field) => {
    initialFormState[field.name] = field.value || "";
  });

  const [configState, setConfigState] = useState(config);
  const [, setFormState] = useState(initialFormState);

  const handleInput = (name: string, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setConfigState((prevConfig) =>
      prevConfig.map((row) =>
        row.map((field) =>
          field.name === name ? { ...field, value } : field
        )
      )
    );
    onFilterChange(name, value);
  };

  const handleBlur = (name: string, value: string) => {
    handleInput(name, value);
  };

  const handleFocus = (name: string) => {
    setConfigState((prevConfig) =>
      prevConfig.map((row) =>
        row.map((field) =>
          field.name === name ? { ...field, state: "default" } : field
        )
      )
    );
  };

  return (
    <div className="flex flex-row flex-wrap gap-4 justify-start items-end w-full mb-4">
      {configState.flat().map((field) => (
        <Input
          key={field.id}
          field={field}
          onInput={handleInput}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
      ))}
    </div>
  );
}