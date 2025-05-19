export default class NotFoundPage {
  async render() {
    return `
      <section class="container">
        <h1>404 - Page Not Found</h1>
        <p>Halaman yang kamu cari tidak ditemukan.</p>
        <a href="#/">Kembali ke Beranda</a>
      </section>
    `;
  }

  async afterRender() {
  }
}