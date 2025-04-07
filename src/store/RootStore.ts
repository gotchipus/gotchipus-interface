import { makeObservable } from "mobx";
import WalletStore from "./WalletStores";

class RootStore {
  walletStore: WalletStore;

  constructor() {
    this.walletStore = new WalletStore();
    makeObservable(this, { walletStore: false });
  }

}

export default RootStore;
