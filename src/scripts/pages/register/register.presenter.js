export default class RegisterPresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async register() {
    const input = this.#view.inputRegister();

    await this.#model.register(input);
    console.log('berhasil loginn!!!')
  }
}