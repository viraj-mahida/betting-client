import { AnchorProvider, Program } from "@coral-xyz/anchor";
import bettingIDL from "../idl/simple_betting.json";
import { PublicKey } from "@solana/web3.js";
import { SimpleBetting } from "../types/simple_betting";

export const BETTING_PROGRAM_ID = new PublicKey(
  "BETTYxvFKRvF9ov3r7rNcW6nFLm5Kmmy3JdXzM1LgB56"
);

export function getBettingProgram(provider: AnchorProvider): Program<SimpleBetting> {
  return new Program<SimpleBetting>(bettingIDL, provider);
}