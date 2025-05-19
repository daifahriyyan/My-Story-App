import getData from "../../data/api";
import AboutPresenter from "./about-presenter";

export default class AboutPage {
  #presenter;
  async render() {
    return `
      <section class="container">
        <h1>About Page</h1>
        <div id="bookmark-list"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AboutPresenter({
      model: new getData(),
      view: this,
    })

    this.#presenter.getBookmarkList();
  }

  bookmarkList() {
    return document.getElementById('bookmark-list');
  }
}
