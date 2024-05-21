# <img src="https://uxwing.com/wp-content/themes/uxwing/download/hand-gestures/good-icon.png" height="60" valign="middle" alt="Safe{Wallet} lite" style="background: #fff; padding: 20px; margin: 0 -20px" /> Safe{Wallet} lite

No Backend Safe solution

## Contributing

Contributions, be it a bug report or a pull request, are very welcome.

## Getting started with local development

### Environment variables

Create a `.env` file with environment variables. You can use the `.env.example` file as a reference.

Here's the list of all the environment variables:

| Env variable                  | Description                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_WC_PROJECT_ID`   | [WalletConnect v2](https://docs.walletconnect.com/2.0/cloud/relay) project ID |
| `NEXT_PUBLIC_GLOBAL_SAFE_URL` | Optionally, url to fetch safe accounts on your chain                          |

Fetching safes only one placec where API used, only for convenience testing, you can fetch safes manually

### Running the app locally

Install the dependencies:

```bash
npm i
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Lint

ESLint:

```
yarn lint --fix
```

## Build and run in production mode:

```
npm run build
npm run start
```

## Pre-push hooks

This repo has a pre-commit hook that runs the linter (always)
before pushing. If you want to skip the hooks, you can use the `--no-verify` flag.

## Frameworks

This app is built using the following frameworks:


- [Safe Core SDK](https://github.com/safe-global/safe-core-sdk)
- [Safe Gateway SDK](https://github.com/safe-global/safe-gateway-typescript-sdk)
- Next.js
- React
- Zustand
- MUI
- ethers.js
- @web3modal
- @walletconnect/core
- @walletconnect/web3wallet
