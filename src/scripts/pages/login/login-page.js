import getData from "../../data/api";
import LoginPresenter from "./login-presenter";

export default class LoginPage {
  #presenter;

  async render() {
    return `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Login Page</h1>
        <form id="form-login">
          <div>
            <label for="input-email">email: </label><br>
            <input type="email" id="input-email">
          </div>
          <div>
            <label for="input-password">password: </label><br>
            <input type="password" id="input-password">
          </div>
          <div>
            <span>Belum punya akun? silahkan <a href="#/register">register</a>!</span><br>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
    `
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      model: new getData(),
      view: this,
    })

    document.querySelector('#form-login').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#presenter.authenticate();
    })
  }

  inputLogin() {
    const input = {
      email: document.querySelector('#input-email').value,
      password: document.querySelector('#input-password').value,
    }

    return input;
  }
}