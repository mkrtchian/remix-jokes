import { useFormContext, useIsSubmitting } from "remix-validated-form";

export const SubmitButton = () => {
  const isSubmitting = useIsSubmitting();
  const { isValid } = useFormContext();
  const disabled = isSubmitting || !isValid;

  return (
    <button type="submit" disabled={disabled} className="button">
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};
