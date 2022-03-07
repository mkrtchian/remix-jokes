import { useField } from "remix-validated-form";

type InputProps = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "radio" | "password";
  defaultValue?: string;
  defaultChecked?: boolean;
  value?: string;
};

export const Input = ({
  name,
  label,
  type,
  defaultValue,
  defaultChecked,
  value,
}: InputProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        {...getInputProps({
          id: name,
          type,
          value,
          "aria-invalid": Boolean(error),
          "aria-describedby": `${name}-error`,
        })}
        defaultValue={defaultValue}
        defaultChecked={defaultChecked}
      />
      {error && (
        <p className="form-validation-error" role="alert" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};
