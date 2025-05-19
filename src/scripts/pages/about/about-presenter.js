import { deleteBookmark, getAllBookmark } from "../../data/database";

export default class AboutPresenter {
  #view;
  #model;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async getBookmarkList() {
    const bookmarks = await getAllBookmark();

    this.#view.bookmarkList().innerHTML = bookmarks.map((item) => `
      <div class="card" data-id="${item.id}">
        <h2>Story of ${item.name}</h2>
        <h3>Created at: ${new Date(item.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</h3>
        <img src="${item.photoUrl}" alt="story-of-${item.name}">
        <h4 class="coordinate">Coordinate: ${Number(item.lat).toFixed(4)}, ${Number(item.lon).toFixed(4)}</h4>
        <article>
          <p>${item.description}</p>
        </article>
        <button id="delete-story">Delete</button>
      </div>
  `).join('');

    // 🔁 Pasang event listener ke semua tombol delete
    this.#view.bookmarkList().querySelectorAll('#delete-story').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const card = event.target.closest('.card');
        const id = card.getAttribute('data-id');

        console.log('Deleting ID:', card);
        await deleteBookmark(id);
        this.getBookmarkList();
      });
    });
  }
}