// constants.js - Centralized constants for reusability

export const DEFAULT_AMOUNT = 10.0;

export const CURRENCIES = {
  ZCASH: {
    name: "Zcash",
    symbol: "ZEC",
    getIcon: (theme) =>
      ({
        red: "zcash.svg",
        dark: "zcash.svg",
        light: "zcash.svg",
        zebra: "zcash.svg",
      }[theme] || "zcash.svg"),
    balance: 1000.0,
  },
  AVALANCHE: {
    name: "Avalanche",
    symbol: "ZEC.rbr",
    getIcon: (theme) =>
        ({
          red: "avax.svg",
          dark: "avax.svg",
          light: "avax.svg",
          zebra: "avax_white.svg",
        }[theme] || "avax.svg"),
    balance: 700.0,
  },
};

export const BRIDGING_FEE = 0.01;

export const THEMES = ["red", "dark", "light", "zebra"];
