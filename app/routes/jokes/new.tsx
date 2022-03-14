import { withZod } from "@remix-validated-form/with-zod";
import type { ActionFunction, LoaderFunction } from "remix";
import { Link, redirect, useActionData, useCatch, useTransition } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { Input } from "~/components/forms/Input";
import { SubmitButton } from "~/components/forms/SubmitButton";
import { Textarea } from "~/components/forms/Textarea";
import { JokeDisplay } from "~/components/joke";
import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return {};
};

const dataSchema = z.object({
  name: z.string().min(2).nonempty("That joke's name is too short"),
  content: z.string().min(10).nonempty("That joke is too short"),
});
type DataSchema = z.infer<typeof dataSchema>;
const validator = withZod(dataSchema);

type ActionData = {
  formError?: string;
  fields?: DataSchema;
};

function stringifyNulls(element: string | null): string {
  return typeof element === "string" ? element : "";
}

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return `That joke is too short`;
  }
}

function validateJokeName(name: string) {
  if (name.length < 2) {
    return `That joke's name is too short`;
  }
}

export let action: ActionFunction = async ({ request }) => {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { name, content } = data.data;
  const userId = await requireUserId(request);

  const fields = {
    name: stringifyNulls(name),
    content: stringifyNulls(content),
  };
  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();

  if (transition.submission) {
    const name = transition.submission.formData.get("name");
    const content = transition.submission.formData.get("content");
    if (
      typeof name === "string" &&
      typeof content === "string" &&
      !validateJokeContent(content) &&
      !validateJokeName(name)
    ) {
      return (
        <JokeDisplay
          joke={{ name, content }}
          isOwner={true}
          canDelete={false}
        />
      );
    }
  }

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <ValidatedForm validator={validator} method="post">
        <Input
          label="Name:"
          type="text"
          name="name"
          defaultValue={actionData?.fields?.name}
        />
        <Textarea
          label="Content:"
          name="content"
          defaultValue={actionData?.fields?.content}
        />
        <div>
          <SubmitButton label="Add" submittingLabel="Adding..." />
        </div>
      </ValidatedForm>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
