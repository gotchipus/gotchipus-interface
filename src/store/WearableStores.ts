import { makeAutoObservable } from "mobx";

class WearableStore {
  isRefreshing: boolean = false;
  imageVersion: number = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setIsRefreshing(isRefreshing: boolean) {
    this.isRefreshing = isRefreshing;
  }

  setImageVersion(imageVersion: number) {
    this.imageVersion = imageVersion;
  }
}

export default WearableStore;