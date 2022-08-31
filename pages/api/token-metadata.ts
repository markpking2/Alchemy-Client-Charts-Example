import type { NextApiRequest, NextApiResponse } from "next";
import { Alchemy } from "alchemy-sdk";

import { alchemySettings } from "../../config";

const alchemy = new Alchemy(alchemySettings);

const getTokenMetadata = async (address: string) => {
  return await alchemy.core.getTokenMetadata(address);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET": {
      try {
        const { address } = req.query;
        const tokenMetadata = await getTokenMetadata(address as string);
        res.status(200).json(tokenMetadata);
      } catch (err) {
        res.status(500).json({ message: "Error getting token metadata." });
      }
      break;
    }
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
