import { useFormContext, useIsSubmitting } from "remix-validated-form";

type SubmitButtonProps = {
  label?: string;
  submittingLabel?: string;
};

export function SubmitButton({
  label = "Submit",
  submittingLabel = "Submitting...",
}: SubmitButtonProps) {
  const isSubmitting = useIsSubmitting();
  const { isValid } = useFormContext();
  const disabled = isSubmitting || !isValid;

  return (
    <button type="submit" disabled={disabled} className="button">
      {isSubmitting ? submittingLabel : label}
    </button>
  );
}
