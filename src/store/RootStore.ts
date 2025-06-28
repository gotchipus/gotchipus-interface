import { makeObservable } from "mobx";
import WalletStore from "./WalletStores";
import WearableStore from "./WearableStores";
import StoryStore from "./storyStore";

class RootStore {
  walletStore: WalletStore;
  wearableStore: WearableStore;
  storyStore: StoryStore;

  constructor() {
    this.walletStore = new WalletStore();
    this.wearableStore = new WearableStore();
    this.storyStore = new StoryStore();
    makeObservable(this, { walletStore: false, wearableStore: false, storyStore: false });
  }

}

export default RootStore;
