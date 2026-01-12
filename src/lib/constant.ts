import { Token } from "@/lib/types"

export const WINDOW_SIZE = {
  "pharos": {
    "width": 1200,
    "height": 800
  },
  "marketplace": {
    "width": 500,
    "height": 400
  },
  "nft": {
    "width": 500,
    "height": 400
  },
  "ai": {
    "width": 1200,
    "height": 800
  },
  "dashboard": {
    "width": 1200,
    "height": 800
  },
  "about": {
    "width": 800,
    "height": 800
  },
  "farm": {
    "width": 1200,
    "height": 800
  },
  "hooks": {
    "width": 800,
    "height": 600
  },
  "dna": {
    "width": 1200,
    "height": 800
  },
  "mint": {
    "width": 800,
    "height": 700
  },
  "wearable": {
    "width": 1200,
    "height": 800
  },
  "daily-task-hall": {
    "width": 1000,
    "height": 800
  },
  "wallet-connect-tba": {
    "width": 600,
    "height": 800
  },
  "all-gotchi": {
    "width": 1200,
    "height": 800
  }
};


export const WINDOW_BG_COLOR = {
  "pharos": "#ffddee",
  "marketplace": "#ffddee",
  "nft": "#ffddee",
  "ai": "#ffddee",
  "dashboard": "#ffddee",
  "farm": "#ffddee",
  "hooks": "#ffddee",
  "dna": "#ffddee",
  "mint": "#ffddee",
  "wearable": "#ffddee",
  "daily-task-hall": "#ffddee",
  "wallet-connect-tba": "#ffddee",
  "all-gotchi": "#ffddee"
};

export const CHAIN_ID = 688689;
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const BG_BYTES32 = "0x676f746368697075732d62670000000000000000000000000000000000000000";
export const BODY_BYTES32 = "0x676f746368697075732d626f6479000000000000000000000000000000000000";
export const EYE_BYTES32 = "0x676f746368697075732d65796500000000000000000000000000000000000000";
export const HAND_BYTES32 = "0x676f746368697075732d68616e64000000000000000000000000000000000000";
export const FACE_BYTES32 = "0x676f746368697075732d66616365000000000000000000000000000000000000";
export const MOUTH_BYTES32 = "0x676f746368697075732d6d6f7574680000000000000000000000000000000000";
export const HEAD_BYTES32 = "0x676f746368697075732d68656164000000000000000000000000000000000000";
export const CLOTHES_BYTES32 = "0x676f746368697075732d636c6f74686573000000000000000000000000000000";

export const Tokens: Token[] = [
  { name: "Pharos", symbol: "PHRS", icon: "/tokens/pharos.png", contract: "0x0000000000000000000000000000000000000000", balance: "0", decimals: 18, popular: false },
  { name: "USD Coin", symbol: "USDC", icon: "/tokens/usdc.png", contract: "0xE0BE08c77f415F577A1B3A9aD7a1Df1479564ec8", balance: "0", decimals: 6, popular: false },
  { name: "Wrapped Ether", symbol: "WETH", icon: "/tokens/eth.png", contract: "0x7d211F77525ea39A0592794f793cC1036eEaccD5", balance: "0", decimals: 18, popular: false },
  { name: "Tether USD", symbol: "USDT", icon: "/tokens/usdt.png", contract: "0xE7E84B8B4f39C507499c40B4ac199B050e2882d5", balance: "0", decimals: 6, popular: false },
  { name: "Wrapped BTC", symbol: "WBTC", icon: "/tokens/wbtc.png", contract: "0x0c64F03EEa5c30946D5c55B4b532D08ad74638a4", balance: "0", decimals: 8, popular: false },
  { name: "Wrapped PHRS", symbol: "WPHRS", icon: "/tokens/pharos.png", contract: "0x838800b758277CC111B2d48Ab01e5E164f8E9471", balance: "0", decimals: 8, popular: false },
];