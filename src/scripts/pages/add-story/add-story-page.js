// import { convertBase64ToBlob } from "../../utils";
import getData from "../../data/api";
import AddStoryPresenter from "./add-story-presenter";
import Camera from "../../utils/camera";
import Map from "../../utils/map";

export default class AddStoryPage {
  #presenter;
  #form;
  #camera;
  #isCameraOpen = false;
  #takenDocumentation = null;
  #map;

  async render() {
    return `
    <section class="container add-story">
      <h1>ADD STORY PAGE</h1>
      <form id="add-story-form">
        <div class="new-form__documentations__container">
          <div class="new-form__documentations__buttons">
            <button id="documentations-input-button" class="btn btn-outline" type="button">
              Ambil Gambar
            </button>
            <input
              id="documentations-input"
              name="documentations"
              type="file"
              accept="image/*"
              hidden="hidden"
              aria-describedby="documentations-more-info"
            >
            <button id="open-documentations-camera-button" class="btn btn-outline" type="button">
              Buka Kamera
            </button>
          </div>
          <div id="camera-container" class="new-form__camera__container">
            <video id="camera-video" class="new-form__camera__video">
              Video stream not available.
            </video>
            <canvas id="camera-canvas" class="new-form__camera__canvas"></canvas>

            <div class="new-form__camera__tools">
              <select id="camera-select"></select>
              <div class="new-form__camera__tools_buttons">
                <button id="camera-take-button" class="btn" type="button">
                  Ambil Gambar
                </button>
              </div>
            </div>
          </div>
          <ul id="documentations-taken-list" class="new-form__documentations__outputs"></ul>
        </div>
        <div class="description-and-location">
          <div>
            <label for="input-description">Deskripsi : </label><br>
            <textarea id="input-description" required></textarea>
          </div>
          <div class="form-control">
            <label>Lokasi</label>

            <div class="new-form__location__container">
              <div class="new-form__location__map__container">
                <div id="map" class="new-form__location__map"></div>
              </div>
              <div class="new-form__location__lat-lng">
                <span for="input-latitude">Lat:</span>
                <input type="number" id="input-latitude" name="input-latitude" value="-6.175389" disabled>
                <span for="input-longitude">Lon:</span>
                <input type="number" id="input-longitude" name="input-longitude" value="106.827139" disabled>
              </div>
            </div>
          </div>
        </div>
        <div style="display: flex; justify-content:center;">
          <button class="btn" type="submit">Buat Story</button>
        </div>
      </form>
    </section>
  `;
  }

  async afterRender() {
    this.#presenter = new AddStoryPresenter({
      model: new getData(),
      view: this,
    });

    this.#setupForm();
    this.initialMap();
  }

  inputStory() {
    const input = {
      photo: document.querySelector('#input-photo').files[0],
      description: document.querySelector('#input-description').value,
      lat: parseFloat(document.querySelector('#input-latitude').value),
      lon: parseFloat(document.querySelector('#input-longitude').value),
    };

    return input;
  }

  #setupForm() {
    this.#form = document.getElementById('add-story-form');
    this.#form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        description: this.#form.elements.namedItem('input-description').value,
        lat: parseFloat(this.#form.elements.namedItem('input-latitude').value),
        lon: parseFloat(this.#form.elements.namedItem('input-longitude').value),
        photo: this.#takenDocumentation ? this.#takenDocumentation.blob : null,
      };
      await this.#presenter.addStory(data);
    });

    document.getElementById('documentations-input').addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (file) {
        await this.#addTakenPicture(file);
        await this.#populateTakenPictures();
      }
    });

    document.getElementById('documentations-input-button').addEventListener('click', () => {
      document.getElementById('documentations-input').click();
    });

    const cameraContainer = document.getElementById('camera-container');
    document
      .getElementById('open-documentations-camera-button')
      .addEventListener('click', async (event) => {
        cameraContainer.classList.toggle('open');
        this.#isCameraOpen = cameraContainer.classList.contains('open');

        if (this.#isCameraOpen) {
          event.currentTarget.textContent = 'Tutup Kamera';
          this.#setupCamera();
          await this.#camera.launch();

          return;
        }

        event.currentTarget.textContent = 'Buka Kamera';
        this.#camera.stop();
      });
  }

  #setupCamera() {
    if (!this.#camera) {
      this.#camera = new Camera({
        video: document.getElementById('camera-video'),
        cameraSelect: document.getElementById('camera-select'),
        canvas: document.getElementById('camera-canvas'),
      });
    }

    this.#camera.addCheeseButtonListener('#camera-take-button', async () => {
      const image = await this.#camera.takePicture();
      await this.#addTakenPicture(image);
      await this.#populateTakenPictures();
    });
  }

  async #addTakenPicture(image) {
    let blob = image;

    if (typeof image === 'string') {
      blob = await convertBase64ToBlob(image, 'image/png');
    }

    const newDocumentation = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };
    this.#takenDocumentation = newDocumentation;
  }

  async #populateTakenPictures() {
    const html = this.#takenDocumentation ? `
      <li class="new-form__documentations__outputs-item">
        <button type="button" data-deletepictureid="${this.#takenDocumentation.id}" class="new-form__documentations__outputs-item__delete-btn">
          <img src="${URL.createObjectURL(this.#takenDocumentation.blob)}" alt="Dokumentasi" width="200">
        </button>
      </li>
    ` : '';

    document.getElementById('documentations-taken-list').innerHTML = html;

    document.querySelectorAll('button[data-deletepictureid]').forEach((button) =>
      button.addEventListener('click', (event) => {
        const pictureId = event.currentTarget.dataset.deletepictureid;

        const deleted = this.#removePicture(pictureId);
        if (!deleted) {
          console.log(`Picture with id ${pictureId} was not found`);
        }

        // Updating taken pictures
        this.#populateTakenPictures();
      }),
    );
  }

  #removePicture(id) {
    if (this.#takenDocumentation && this.#takenDocumentation.id === id) {
      const selectedPicture = this.#takenDocumentation;
      this.#takenDocumentation = null;
      return selectedPicture;
    }
    return null;
  }


  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
      locate: true,
    });

    // Preparing marker for select coordinate
    const centerCoordinate = this.#map.getCenter();

    this.#updateLatLngInput(centerCoordinate.latitude, centerCoordinate.longitude);

    const draggableMarker = this.#map.addMarker(
      [centerCoordinate.latitude, centerCoordinate.longitude],
      { draggable: 'true' },
    )

    draggableMarker.addEventListener('move', (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });

    this.#map.addMapEventListener('click', (event) => {
      draggableMarker.setLatLng(event.latlng);

      // Keep center with user view
      event.sourceTarget.flyTo(event.latlng);
    });
  }

  #updateLatLngInput(latitude, longitude) {
    this.#form.elements.namedItem('input-latitude').value = latitude;
    this.#form.elements.namedItem('input-longitude').value = longitude;
  }
}