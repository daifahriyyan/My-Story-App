export default class HomePresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  getData() {
    // get data dengan promise
    const stories = this.#model.getStories().then((response) => {
      if (response.error) {
        console.log(`Error: ${response.message}`);
      } else {
        console.log(`Success: ${response.message}`);
        return response.listStory;
      }
    }).catch((error) => {
      console.log(`Error: ${error}`);
    });

    // Memanggil function showStories dari view
    this.#view.showStories(stories);
  }
}