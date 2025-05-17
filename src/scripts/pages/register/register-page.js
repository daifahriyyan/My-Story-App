import getData from "../../data/api";
import RegisterPresenter from "./register.presenter";

export default class RegisterPage {
  #presenter;

  async render() {
    return `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Register Page</h1>
        <form id="form-register">
          <div>
            <label for="input-name">Name: </label><br>
            <input type="text" id="input-name">
          </div>
          <div>
            <label for="input-email">email: </label><br>
            <input type="email" id="input-email">
          </div>
          <div>
            <label for="input-password">password: </label><br>
            <input type="password" id="input-password">
          </div>
          <div>
            <span>Sudah punya akun? silahkan <a href="#/login">login</a>!</span><br>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
    `
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      model: new getData(),
      view: this,
    })

    document.querySelector('#form-register').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#presenter.register();
    })
  }

  inputRegister() {
    const input = {
      name: document.querySelector('#input-name').value,
      email: document.querySelector('#input-email').value,
      password: document.querySelector('#input-password').value,
    }

    return input;
  }
}