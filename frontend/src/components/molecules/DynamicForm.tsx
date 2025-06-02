import React, { useState } from "react";
import type { DynamicFormProps } from "@/types/dynamicForm";
import type { FieldConfig } from "@/types/input";
import Input from "../atoms/Input";

export default function DynamicForm({ config, onSubmit }: DynamicFormProps) {
  const initialFormState: Record<string, string> = {};
  config.flat().forEach((field) => {
    initialFormState[field.name] = field.value || "";
  });

  const [configState, setConfigState] = useState(config);
  const [formState, setFormState] = useState(initialFormState);
  const [buttonState, setButtonState] = useState<'disabled' | 'enabled'>('disabled');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  const handleInput = (name: string, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setConfigState((prevConfig) =>
      prevConfig.map((row) =>
        row.map((field) => {
          if (field.name === name) {
            return {
              ...field,
              value: value,
            };
          }
          return field;
        }
        )
      )
    );
  }
  const handleBlur = (name: string, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setConfigState((prevConfig) =>
      prevConfig.map((row) =>
        row.map((field) => {
          if (field.name === name) {
            return {
              ...field,
              value: value,
              state: 'default',
              touched: true,
            };
          }
          return field;
        }
        )
      )
    );
    setButtonState(
      validateForm() ? 'enabled' : 'disabled'
    );
  }
  const handleFocus = (name: string) => {
    setConfigState((prevConfig) =>
      prevConfig.map((row) =>
        row.map((field) => {
          if (field.name === name) {
            return {
              ...field,
              state: 'default',
              touched: true,
            };
          }
          return field;
        }
        )
      )
    );
  };
  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    const configUpdated: FieldConfig[][] = configState.map((row) =>
      row.map((field) => {
        const fieldValue = formState[field.name]?.trim() || '';
        if (field.required && !fieldValue) {
          const messageError = 'Este campo es obligatorio';
          errors[field.name] = messageError;
          return !field.touched ? field : { ...field, state: 'error', validationMessage: messageError };
        } else if (field.regex && !new RegExp(field.regex).test(fieldValue)) {
          const messageError = config.flat().find(f => f.name === field.name)?.validationMessage || 'Formato inválido';
          errors[field.name] = messageError;
          return !field.touched ? field : { ...field, state: 'error', validationMessage: messageError };
        } else {
          return !field.touched ? field : { ...field, state: 'success', validationMessage: '' };
        }
      })
    )

    setConfigState(configUpdated);
    return Object.keys(errors).length === 0;
  }

  return (
    <form
      className="flex flex-col gap-4 justify-center items-center"
      onSubmit={handleSubmit}>
      {configState.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}
        >
          {row.map((field) => (
            <Input
              key={field.id}
              field={field}
              onInput={handleInput}
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
          ))}
        </div>
      ))}
      <div className="flex justify-center w-full">
        <button
          type="submit"
          disabled={buttonState === 'disabled'}
          className="w-full p-2 px-10 text-white rounded-l-sm flex justify-center bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out rounded-md disabled:cursor-not-allowed"
        >
          Enviar
        </button>
      </div>
    </form>
  );
};