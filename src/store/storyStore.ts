import { makeAutoObservable, runInAction } from "mobx";


class StoryStore {
  gotchiName: string = "";
  gotchiStory: string = "";
  isFetching: boolean = false;
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setGotchiName(name: string) {
    this.gotchiName = name;
  }

  setGotchiStory(story: string) {
    this.gotchiStory = story;
  }

  setIsFetching(isFetching: boolean) {
    this.isFetching = isFetching;
  }

}

export default StoryStore;