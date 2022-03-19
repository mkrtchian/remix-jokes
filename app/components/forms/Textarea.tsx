import { useField } from "remix-validated-form";

type TextareaProps = {
  name: string;
  label: string;
  defaultValue?: string;
  value?: string;
};

export const Textarea = ({
  name,
  label,
  defaultValue,
  value,
}: TextareaProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <textarea
        {...getInputProps({
          id: name,
          value,
          "aria-invalid": Boolean(error),
          "aria-describedby": `${name}-error`,
        })}
        defaultValue={defaultValue}
      />
      {error && (
        <p className="form-validation-error" role="alert" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};
