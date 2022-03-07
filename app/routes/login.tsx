import { withZod } from "@remix-validated-form/with-zod";
import type { ActionFunction, LinksFunction, MetaFunction } from "remix";
import { json, Link, useActionData, useSearchParams } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { Input } from "~/components/forms/Input";
import { SubmitButton } from "~/components/forms/SubmitButton";
import { db } from "~/utils/db.server";
import { createUserSession, login, register } from "~/utils/session.server";
import stylesUrl from "../styles/login.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const meta: MetaFunction = () => {
  return {
    title: "Remix Jokes | Login",
    description: "Login to submit your own jokes to Remix Jokes!",
  };
};

const dataSchema = z.object({
  loginType: z.enum(["login", "register"]),
  username: z.string().min(3).nonempty("Username is required"),
  password: z.string().min(6).nonempty("Password is required"),
  redirectTo: z.optional(z.string()),
});
type DataSchema = z.infer<typeof dataSchema>;
const validator = withZod(dataSchema);

type ActionData = {
  formError?: string;
  fields?: DataSchema;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { username, password, redirectTo, loginType } = data.data;
  const redirectToPage = redirectTo || "/jokes";

  const fields: DataSchema = { username, password, redirectTo, loginType };
  switch (loginType) {
    case "login": {
      const user = await login({ username, password });
      if (!user) {
        return {
          fields,
          formError: `Username/Password combination is incorrect`,
        };
      }
      return createUserSession(user.id, redirectToPage);
    }
    case "register": {
      const userExists = await db.user.findFirst({
        select: { id: true },
        where: { username },
      });
      if (userExists) {
        return badRequest({
          fields,
          formError: `User with username ${username} already exists`,
        });
      }
      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fields,
          formError: `Something went wrong trying to create a new user.`,
        });
      }
      return createUserSession(user.id, redirectToPage);
    }
    default: {
      return badRequest({
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <ValidatedForm
          validator={validator}
          method="post"
          aria-describedby={
            actionData?.formError ? "form-error-message" : undefined
          }
        >
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <Input
              label="Login"
              type="radio"
              name="loginType"
              value="login"
              defaultChecked={
                !actionData?.fields?.loginType ||
                actionData?.fields?.loginType === "login"
              }
            />
            <Input
              label="Register"
              type="radio"
              name="loginType"
              value="register"
              defaultChecked={actionData?.fields?.loginType === "register"}
            />
          </fieldset>
          <div>
            <Input
              label="Username"
              type="text"
              name="username"
              defaultValue={actionData?.fields?.username}
            />
          </div>
          <div>
            <Input
              label="Password"
              name="password"
              defaultValue={actionData?.fields?.password}
              type="password"
            />
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData?.formError}
              </p>
            ) : null}
          </div>
          <SubmitButton />
        </ValidatedForm>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jokes">Jokes</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
