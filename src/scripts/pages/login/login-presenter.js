export default class LoginPresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async authenticate() {
    const input = this.#view.inputLogin();

    await this.#model.authenticate(input);
    console.log('berhasil loginn!!!')
  }
}