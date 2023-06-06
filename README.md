# One Zero

## How to use

Install all dependencies before starting (check all `Cargo.toml` and
`package.json` files).

### Deploy contracts on testnet

Run the dev deploy script with root directory as `./contract` to build the
contracts (might need to build twice as marketplace includes bytes of token).

```sh
cd contract
make dev-deploy
```

### Conduct testing on contracts

Cd into the tests directory.

```sh
cd ./contract/tests
```

Run the test script.

```sh
pnpm test
```

### Setup frontend

> Ensure that contracts have been deployed on testnet first.

Make an environment variables file.

```sh
touch frontend/.env
```

Copy account id in `neardev/dev-account` to the `.env` file.

```text
# .env
NEXT_PUBLIC_MKTPLC_CONTRACT="<account_id_here>"
```

Start the dev server.

```sh
npm run dev
```
