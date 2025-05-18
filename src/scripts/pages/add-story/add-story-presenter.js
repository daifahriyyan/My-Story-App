export default class AddStoryPresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async addStory(input) {
    // const input = this.#view.inputStory();
    const token = sessionStorage.getItem('token');

    if (token) {
      await this.#model.addStory(input, token);
    } else {
      await this.#model.addGuestStory(input);
    }
  }
}