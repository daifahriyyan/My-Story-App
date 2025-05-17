import getData from "../../data/api";
import StoriesPresenter from "./stories-presenter";

export default class StoriesPage {
  #presenter;

  async render() {
    return `
    <button class="skip-to-content">skip to content</button>

      <section class="container">
        <h1>STORIES PAGE</h1>
        <button class="btn-add-story">
        <a href="#/add-story">Tambah</a>
        </button>
        <div id="stories"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new StoriesPresenter({
      model: new getData(),
      view: this,
    });

    await this.#presenter.getData();
    document.querySelector('.skip-to-content').addEventListener('click', () => {
      const target = document.getElementById('stories');
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  showStories(stories) {
    // Membuat cards story
    const story = stories.then((items) => items.reduce((acc, item) => {
      acc += `
      <a href="#/stories/${item.id}">
        <div class="card">
          <h2>Story of ${item.name}</h2>
          <h3>Created at: ${new Date(item.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</h3>
          <img src="${item.photoUrl}" alt="story-of-${item.name}">
          <h4 class="coordinate">Coordinate: ${Number(item.lat).toFixed(4)}, ${Number(item.lon).toFixed(4)}</h4>
          <article>
            <p>${item.description}</p>
          </article>
        </div>
      </a>
      `;

      return acc;
    }, ''));

    story.then((storiesHTML) => {
      document.querySelector('#stories').innerHTML = storiesHTML;
    });
  }
}
