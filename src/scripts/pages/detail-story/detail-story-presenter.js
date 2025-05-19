import { addBookmark } from "../../data/database";

export default class DetailStoryPresenter {
  #storyId;
  #model;
  #view;

  constructor(storyId, { model, view }) {
    this.#storyId = storyId;
    this.#model = model;
    this.#view = view;
  }

  async getStoryDetail() {
    const item = await this.#model.getStoryDetail(this.#storyId);

    await this.#view.initialMap(item.story);
    this.#view.showStory(item.story);
  }

  async addBookmark() {
    const item = await this.#model.getStoryDetail(this.#storyId);

    document.getElementById('add-bookmark').addEventListener('click', async () => {
      addBookmark(item.story);
    })
  }
}