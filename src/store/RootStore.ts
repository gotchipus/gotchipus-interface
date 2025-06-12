import { makeObservable } from "mobx";
import WalletStore from "./WalletStores";
import WearableStore from "./WearableStores";

class RootStore {
  walletStore: WalletStore;
  wearableStore: WearableStore;

  constructor() {
    this.walletStore = new WalletStore();
    this.wearableStore = new WearableStore();
    makeObservable(this, { walletStore: false, wearableStore: false });
  }

}

export default RootStore;
