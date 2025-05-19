import getData from "../../data/api";
import { parseActivePathname } from "../../routes/url-parser"
import Map from "../../utils/map";
import DetailStoryPresenter from "./detail-story-presenter";

export default class DetailStoryPage {
  #presenter;
  #map = null;

  async render() {
    return `
    <section id="story">
      <h1>DETAIL STORY PAGEasdasd</h1>
      <div class="detail-story-container">
        <div id="detail-story"></div>
        <h2>Lokasi </h2>
        <div id="map"></div>
        <h4 class="coordinate"></h4>
        <a href="#/stories">
          <button>Back to Stories</button>
        </a>
        <button id="add-bookmark">Add Bookmark</button>
      </div>
    </section>
    `
  }

  async afterRender() {
    const { id } = parseActivePathname();

    this.#presenter = new DetailStoryPresenter(id, {
      model: new getData(),
      view: this,
    })

    await this.#presenter.getStoryDetail();
    await this.#presenter.addBookmark();
  }

  showStory(item) {
    const html = `
    <div class="card">
      <h2>Created by: ${item.name}</h2>
      <img src="${item.photoUrl}" alt="story-of-${item.name}" width="200">
      <p>${item.description}</p>
    </div>`;

    const coor = `Coordinate: ${Number(item.lat).toFixed(4)}, ${Number(item.lon).toFixed(4)}`

    document.querySelector('#detail-story').innerHTML = html;
    document.querySelector('.coordinate').innerHTML = coor;
  }

  async initialMap(item) {
    this.#map = await Map.build('#map', item, {
      zoom: 10,
      locate: true
    })

    if (item.lat && item.lon) {
      const coordinate = [item.lat, item.lon];
      const markerOptions = { alt: item.name };
      const popupOptions = { content: item.name };
      this.#map.addMarker(coordinate, markerOptions, popupOptions);
    } else {
      return;
    }
  }
}