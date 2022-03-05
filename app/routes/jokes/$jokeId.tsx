import type { Joke } from "@prisma/client";
import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import { json, redirect, useCatch, useLoaderData, useParams } from "remix";
import { getParams } from "remix-params-helper";
import { z } from "zod";
import { JokeDisplay } from "~/components/joke";
import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: "No joke",
      description: "No joke found",
    };
  }
  return {
    title: `"${data.joke.name}" joke`,
    description: `Enjoy the "${data.joke.name}" joke and much more`,
  };
};

type LoaderData = {
  joke: Pick<Joke, "id" | "name" | "content">;
  isOwner: boolean;
};

const ParamsSchema = z.object({
  jokeId: z
    .string()
    .uuid({ message: "The URL parameter must be a valid UUID" }),
});

export const loader: LoaderFunction = async ({ params, request }) => {
  const result = getParams(params, ParamsSchema);
  if (!result.success) {
    throw json(result.errors, {
      status: 400,
    });
  }
  const { jokeId } = result.data;

  const userId = await getUserId(request);
  const joke = await db.joke.findUnique({
    select: { id: true, name: true, content: true, jokesterId: true },
    where: { id: jokeId },
  });
  if (!joke) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
  }
  const data: LoaderData = { joke, isOwner: userId === joke.jokesterId };
  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const result = getParams(params, ParamsSchema);
    if (!result.success) {
      throw json(result.errors, {
        status: 400,
      });
    }
    const { jokeId } = result.data;

    const userId = await requireUserId(request);
    const joke = await db.joke.findUnique({
      where: { id: jokeId },
    });
    if (!joke) {
      throw new Response("Can't delete what does not exist", { status: 404 });
    }
    if (joke.jokesterId !== userId) {
      throw new Response("Pssh, nice try. That's not your joke", {
        status: 401,
      });
    }
    await db.joke.delete({ where: { id: jokeId } });
    return redirect("/jokes");
  }
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();
  return <JokeDisplay joke={data.joke} isOwner={data.isOwner} />;
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  switch (caught.status) {
    case 404: {
      return (
        <div className="error-container">
          Huh? What the heck is {params.jokeId}?
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Sorry, but {params.jokeId} is not your joke.
        </div>
      );
    }
    case 400: {
      return (
        <div className="error-container">
          {params.jokeId} is not a correct format that could correspond to a
          joke.
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${
      jokeId ? jokeId : ""
    }. Sorry.`}</div>
  );
}
