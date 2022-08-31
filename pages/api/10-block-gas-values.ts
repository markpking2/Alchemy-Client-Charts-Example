import type { NextApiRequest, NextApiResponse } from "next";
import { fromHex } from "alchemy-sdk";
const alchemySdk = require("api")("@alchemy-docs/v1.0#5p1de4kl6covpyp");
import * as _ from "lodash/fp";

const get10LatestBaseFees = async function () {
  const history = await alchemySdk.ethFeeHistory(
    {
      id: 1,
      jsonrpc: "2.0",
      method: "eth_feeHistory",
      params: [10, "latest"],
    },
    { apiKey: process.env.ALCHEMY_API_URL }
  );
  const baseFees = _.map(
    (fee: string) => fromHex(fee),
    _.slice(0, 10, _.get("result.baseFeePerGas", history))
  );
  const oldestBlock = _.get("result.oldestBlock", history);
  const oldestBlockDecimal = parseInt(oldestBlock, 16);
  const blockNumbers = _.map(
    (key) => parseInt(key, 10) + oldestBlockDecimal,
    _.keys(Array(10))
  );

  return {
    baseFees: _.zip(blockNumbers, baseFees),
    gasUsedRatios: _.zip(blockNumbers, _.get("result.gasUsedRatio", history)),
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET": {
      try {
        const baseFeesByBlockNumber = await get10LatestBaseFees();
        res.status(200).json(baseFeesByBlockNumber);
      } catch (err) {
        res.status(500).json({ message: "Error getting block gas values." });
      }
      break;
    }
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
