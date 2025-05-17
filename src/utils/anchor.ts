import { AnchorProvider, Program } from "@coral-xyz/anchor";
import bettingIDL from "./betting_dapp.json";
import { PublicKey } from "@solana/web3.js";

export const BETTING_PROGRAM_ID = new PublicKey(
  "BETTYxvFKRvF9ov3r7rNcW6nFLm5Kmmy3JdXzM1LgB56"
);

export function getBettingProgram(provider: AnchorProvider) {
  return new Program(bettingIDL, provider);
}
