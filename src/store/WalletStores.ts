import { makeAutoObservable, runInAction } from "mobx";
import { type Address, type Chain } from "viem";


class WalletStore {
  address: Address | undefined = undefined;
  isConnected: boolean = false;
  isConnecting: boolean = false;
  balance: string | undefined = undefined;
  symbol: string | undefined = undefined;
  chainId: number | undefined = undefined;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setWalletState(state: {
    address?: Address;
    isConnected?: boolean;
    isConnecting?: boolean;
    balance?: string;
    symbol?: string;
    chainId?: number;
  }) {
    runInAction(() => {
      Object.assign(this, state);
    });
  }

  reset() {
    runInAction(() => {
      this.address = undefined;
      this.isConnected = false;
      this.isConnecting = false;
      this.balance = undefined;
      this.symbol = undefined;
      this.chainId = undefined;
    });
  }

  get shortAddress() {
    if (!this.address) return '';
    return `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
  }

  get chainName() {
    return this.chainId === 50002 ? 'Pharos Devnet' : 'Unknown Network';
  }

  get formattedBalance() {
    if (!this.balance || !this.symbol) return '';
    const formattedBalance = parseFloat(this.balance).toFixed(4);
    return `${formattedBalance} ${this.symbol}`;
  }
}

export default WalletStore;