# Jokes app using Remix

This app is based on [Remix Jokes app tutorial](https://remix.run/docs/en/v1/tutorials/jokes) and the [associated livestream workshop](https://www.youtube.com/watch?v=hsIWJpuxNj0).

It will be enhanced little by little to showcase what is possible with Remix.

## Demo

The app is [live on Fly.io](https://remix-jokes-roman.fly.dev/).

## Quick install and run locally

```bash
yarn install
printf 'DATABASE_URL="file:./dev.db"\nSESSION_SECRET="blablablablabalbabla"' > .env
yarn db:reset
yarn dev
```

## Deploy to Fly.io

### 1. Install the flyctl CLI:

On Ubuntu, run:

```bash
curl -L https://fly.io/install.sh | sh
```

Then put the fly binary in the PATH variable, in `.profile`:

```bash
# make the Fly.io tool available as fly command
if [ -d "$HOME/.fly/bin" ] ; then
    PATH="$HOME/.fly/bin:$PATH"
fi
```

### 2. Register to Fly.io

```bash
fly auth signup
```

This will open the browser and ask for some information, **including a credit card** (even if the current app works with the free tier).

### 3. Deploy the app

Follow [the rest of the instructions in the jokes tutorial](https://remix.run/docs/en/v1/tutorials/jokes#deployment).
