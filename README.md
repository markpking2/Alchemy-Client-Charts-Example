This app uses [Alchemy's Ethereum client API](https://www.alchemy.com/) to display gas base fees, % of gas used per gas limit, and amount of token transfers for a specified ERC20 token for the latest 10 blocks on the Ethereum mainnet.

### Running the app locally

Add your `ALCHEMY_API_KEY` environment variable to an `.env.local` file in the root directory.
See `.env.local.example`.

Install dependencies:

```bash
yarn install
```

Run dev server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<img src="https://github.com/markpking2/Nextjs-Alchemy-Client-Charts-Example/blob/main/screenshot.png?raw=true" width="100%"/>