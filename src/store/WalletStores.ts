import { makeAutoObservable, runInAction } from "mobx";
import { type Address } from "viem";
import { ethers } from "ethers";

interface DappMetadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
}

interface WalletConnectSession {
  topic: string;
  namespaces?: any;
  acknowledged?: () => Promise<any>;
  metadata?: DappMetadata;
}

class WalletStore {
  address: Address | undefined = undefined;
  isConnected: boolean = false;
  isConnecting: boolean = false;
  balance: string | undefined = undefined;
  symbol: string | undefined = undefined;
  chainId: number | undefined = undefined;
  isWalletConnected: boolean = false;
  isTaskRefreshing: boolean = false;

  walletConnectSession: WalletConnectSession | null = null;
  walletConnectDappMetadata: DappMetadata | null = null;
  walletConnectUri: string = '';
  isWalletConnectConnected: boolean = false;
  isWalletConnectPairing: boolean = false;
  connectedTarget: string = '';
  tokenBoundAccounts: Record<string, string> = {};

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.loadWalletConnectState();
  }

  private loadWalletConnectState() {
    if (typeof window === 'undefined') return;
    
    try {
      const savedState = localStorage.getItem('walletConnectState');
      if (savedState) {
        const state = JSON.parse(savedState);
        runInAction(() => {
          this.walletConnectDappMetadata = state.dappMetadata;
          this.walletConnectUri = state.uri || '';
          this.isWalletConnectConnected = state.isConnected || false;
          this.connectedTarget = state.connectedTarget || '';
        });
      }
    } catch (error) {
      console.error('Failed to load WalletConnect state:', error);
    }
  }

  private saveWalletConnectState() {
    if (typeof window === 'undefined') return;
    
    try {
      const state = {
        dappMetadata: this.walletConnectDappMetadata,
        uri: this.walletConnectUri,
        isConnected: this.isWalletConnectConnected,
        connectedTarget: this.connectedTarget,
      };
      localStorage.setItem('walletConnectState', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save WalletConnect state:', error);
    }
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

  setWalletConnected(isConnected: boolean) {
    runInAction(() => {
      this.isWalletConnected = isConnected;
    });
  }

  setWalletConnectSession(session: WalletConnectSession | null) {
    runInAction(() => {
      this.walletConnectSession = session;
    });
  }

  setWalletConnectDappMetadata(metadata: DappMetadata | null) {
    runInAction(() => {
      this.walletConnectDappMetadata = metadata;
    });
    this.saveWalletConnectState();
  }

  setWalletConnectUri(uri: string) {
    runInAction(() => {
      this.walletConnectUri = uri;
    });
    this.saveWalletConnectState();
  }

  setWalletConnectConnected(isConnected: boolean) {
    runInAction(() => {
      this.isWalletConnectConnected = isConnected;
    });
    this.saveWalletConnectState();
  }

  setWalletConnectPairing(isPairing: boolean) {
    runInAction(() => {
      this.isWalletConnectPairing = isPairing;
    });
  }

  setConnectedTarget(target: string) {
    runInAction(() => {
      this.connectedTarget = target;
    });
    this.saveWalletConnectState();
  }

  setIsTaskRefreshing(isRefreshing: boolean) {
    runInAction(() => {
      this.isTaskRefreshing = isRefreshing;
    });
  }

  resetWalletConnect() {
    runInAction(() => {
      this.walletConnectSession = null;
      this.walletConnectDappMetadata = null;
      this.walletConnectUri = '';
      this.isWalletConnectConnected = false;
      this.isWalletConnectPairing = false;
      this.connectedTarget = '';
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletConnectState');
    }
  }

  setTokenBoundAccount(tokenId: string, address: string) {
    runInAction(() => {
      this.tokenBoundAccounts[tokenId] = address;
    });
  }

  getTokenBoundAccount(tokenId: string): string | undefined {
    return this.tokenBoundAccounts[tokenId];
  }

  resetTokenBoundAccounts() {
    runInAction(() => {
      this.tokenBoundAccounts = {};
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
      this.resetWalletConnect();
      this.resetTokenBoundAccounts();
    });
  }

  get shortAddress() {
    if (!this.address) return '';
    return `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
  }

  get chainName() {
    return this.chainId === 50002 ? 'Pharos Devnet' : 'Unknown Network';
  }

  formattedPharos(point: number = 4) {
    if (!this.balance) return '';
    const formattedBalance = ethers.formatEther(this.balance);
    return parseFloat(formattedBalance).toFixed(point);
  }

  get formattedBalance() {
    if (!this.balance || !this.symbol) return '';
    const formattedBalance = ethers.formatUnits(this.balance, 18);
    return `${formattedBalance} ${this.symbol}`;
  }

}

export default WalletStore;