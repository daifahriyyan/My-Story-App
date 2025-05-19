import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { generateSubscribeButtonTemplate, generateUnsubscribeButtonTemplate } from '../templates';
import { isServiceWorkerAvailable } from '../utils';
import { subscribe, unsubscribe, isCurrentPushSubscriptionAvailable } from '../utils/notification-helper';
import NotFoundPage from './not-found-page';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('notification-tools');
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    const auth = sessionStorage.getItem('token');

    if (isSubscribed && auth) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
      document.getElementById('unsubscribe-button').addEventListener('click', () => {
        unsubscribe().finally(() => {
          this.#setupPushNotification();
        });
      });

      return;
    }

    if (auth) {
      pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
      document.getElementById('subscribe-button').addEventListener('click', () => {
        subscribe().finally(() => {
          this.#setupPushNotification()
        });
      })
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    const page = route ?? new NotFoundPage();

    if (!document.startViewTransition) {
      this.#content.innerHTML = await page.render();
      await page.afterRender();

      return;
    }

    document.startViewTransition(async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    });

    if (isServiceWorkerAvailable()) {
      this.#setupPushNotification();
    }

    const loginBtn = document.querySelector('#login-btn');
    if (sessionStorage.getItem('token')) {
      loginBtn.innerHTML = '<a href="#" id="logout-link">Logout</a>';
      document.querySelector('#logout-link').addEventListener('click', (event) => {
        event.preventDefault();
        this.logout();
      });
    } else {
      loginBtn.innerHTML = '<a href="#/login">Login</a>';
    }
  }

  logout() {
    sessionStorage.removeItem('token');
    window.location.href = '#/';
  }
}

export default App;
