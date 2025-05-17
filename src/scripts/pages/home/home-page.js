import getData from "../../data/api";
import HomePresenter from "./home-presenter";

export default class HomePage {
  #presenter;

  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
      </section>
    `;
  }
}
