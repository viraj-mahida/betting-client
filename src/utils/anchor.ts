import { AnchorProvider, Program } from "@coral-xyz/anchor";
import bettingIDL from "../idl/betting_anchor_2.json";
import { BettingAnchor2 } from "../types/betting_anchor_2";

export function getBettingProgram(provider: AnchorProvider): Program<BettingAnchor2> {
  return new Program<BettingAnchor2>(bettingIDL, provider);
}