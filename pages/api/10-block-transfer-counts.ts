import type { NextApiRequest, NextApiResponse } from "next";
import { Alchemy } from "alchemy-sdk";
const alchemySdk = require("api")("@alchemy-docs/v1.0#4y8wt5c9l79g4ign");
import * as _ from "lodash/fp";
import { toHex, fromHex } from "alchemy-sdk";

import { alchemySettings } from "../../config";

const alchemy = new Alchemy(alchemySettings);

const getTransferCountsByBlock = async function (
  fromBlock: string,
  toBlock: string,
  address: string
) {
  const transfers = [];
  let keepFetching = true;
  let lastPageKey;
  while (keepFetching) {
    // @ts-ignore
    const result = await alchemySdk.alchemyGetAssetTransfers(
      {
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock,
            toBlock,
            withMetadata: false,
            excludeZeroValue: true,
            maxCount: "0x3e8",
            category: ["erc20"],
            contractAddress: [address],
            pageKey: lastPageKey || undefined,
          },
        ],
      },
      {
        apiKey: process.env.ALCHEMY_API_KEY,
      }
    );
    transfers.push(_.get("result.transfers", result));
    lastPageKey = _.get("result.pageKey", result);
    if (!lastPageKey) {
      keepFetching = false;
    }
  }
  return _.toPairs(
    _.mapValues(
      (transactions: Array<Record<string, unknown>>) => _.size(transactions),
      _.groupBy(
        ({ blockNum }) => parseInt(fromHex(blockNum) as unknown as string, 10),
        _.flattenDeep(transfers)
      )
    )
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET": {
      try {
        const { address } = req.query;
        const toBlock = await alchemy.core.getBlockNumber();
        const fromBlock = toBlock - 10;
        const transferCounts = await getTransferCountsByBlock(
          toHex(fromBlock),
          toHex(toBlock),
          address as string
        );

        res.status(200).json(transferCounts);
      } catch (err) {
        res.status(405).json({ message: "Error getting block transfers" });
      }
      break;
    }
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
