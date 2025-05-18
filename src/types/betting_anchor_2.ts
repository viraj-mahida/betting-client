/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/betting_anchor_2.json`.
 */
export type BettingAnchor2 = {
  "address": "6JRShtnTuvqR6Ntvir7Dv3FXVRZhA34EMWXW4zJRZfzx",
  "metadata": {
    "name": "bettingAnchor2",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimWinnings",
      "discriminator": [
        161,
        215,
        24,
        59,
        14,
        236,
        242,
        221
      ],
      "accounts": [
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "claimant",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createMarket",
      "discriminator": [
        103,
        226,
        97,
        235,
        200,
        188,
        251,
        254
      ],
      "accounts": [
        {
          "name": "market",
          "writable": true,
          "signer": true
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "question",
          "type": "string"
        }
      ]
    },
    {
      "name": "placeBet",
      "discriminator": [
        222,
        62,
        67,
        220,
        63,
        166,
        126,
        33
      ],
      "accounts": [
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "bettor",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "choice",
          "type": {
            "defined": {
              "name": "outcome"
            }
          }
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "resolveMarket",
      "discriminator": [
        155,
        23,
        80,
        173,
        46,
        74,
        23,
        239
      ],
      "accounts": [
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "creator",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "outcome",
          "type": {
            "defined": {
              "name": "outcome"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "market",
      "discriminator": [
        219,
        190,
        213,
        55,
        0,
        227,
        198,
        154
      ]
    }
  ],
  "events": [
    {
      "name": "betPlacedEvent",
      "discriminator": [
        218,
        76,
        236,
        147,
        222,
        135,
        81,
        43
      ]
    },
    {
      "name": "marketCreatedEvent",
      "discriminator": [
        130,
        142,
        5,
        16,
        107,
        160,
        73,
        124
      ]
    },
    {
      "name": "marketResolvedEvent",
      "discriminator": [
        87,
        249,
        34,
        139,
        194,
        159,
        14,
        156
      ]
    },
    {
      "name": "winningsClaimedEvent",
      "discriminator": [
        30,
        231,
        120,
        152,
        158,
        82,
        26,
        135
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "marketAlreadyResolved",
      "msg": "Market is already resolved"
    },
    {
      "code": 6001,
      "name": "marketNotResolved",
      "msg": "Market is not yet resolved"
    },
    {
      "code": 6002,
      "name": "invalidBetAmount",
      "msg": "Invalid bet amount"
    },
    {
      "code": 6003,
      "name": "invalidBetChoice",
      "msg": "Invalid bet choice"
    },
    {
      "code": 6004,
      "name": "invalidOutcome",
      "msg": "Invalid outcome"
    },
    {
      "code": 6005,
      "name": "unauthorizedAccess",
      "msg": "Unauthorized access"
    },
    {
      "code": 6006,
      "name": "notAWinner",
      "msg": "Not a winner in this market"
    },
    {
      "code": 6007,
      "name": "invalidMarketState",
      "msg": "Invalid market state"
    },
    {
      "code": 6008,
      "name": "insufficientFunds",
      "msg": "Insufficient funds"
    },
    {
      "code": 6009,
      "name": "overflowError",
      "msg": "Arithmetic overflow"
    }
  ],
  "types": [
    {
      "name": "betPlacedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "bettor",
            "type": "pubkey"
          },
          {
            "name": "choice",
            "type": {
              "defined": {
                "name": "outcome"
              }
            }
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "bettor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bettor",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "market",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "question",
            "type": "string"
          },
          {
            "name": "resolved",
            "type": "bool"
          },
          {
            "name": "outcome",
            "type": {
              "defined": {
                "name": "outcome"
              }
            }
          },
          {
            "name": "totalYesAmount",
            "type": "u64"
          },
          {
            "name": "totalNoAmount",
            "type": "u64"
          },
          {
            "name": "yesBettors",
            "type": {
              "vec": {
                "defined": {
                  "name": "bettor"
                }
              }
            }
          },
          {
            "name": "noBettors",
            "type": {
              "vec": {
                "defined": {
                  "name": "bettor"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "marketCreatedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "question",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "marketResolvedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "outcome",
            "type": {
              "defined": {
                "name": "outcome"
              }
            }
          }
        ]
      }
    },
    {
      "name": "outcome",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "undecided"
          },
          {
            "name": "yes"
          },
          {
            "name": "no"
          }
        ]
      }
    },
    {
      "name": "winningsClaimedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "claimant",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
