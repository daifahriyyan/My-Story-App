import CONFIG from '../config';

const ENDPOINTS = {
  ENDPOINT: `${CONFIG.BASE_URL}`,
};

export default class getData {
  async getStories() {
    const fetchResponse = await fetch(`${ENDPOINTS.ENDPOINT}/stories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLWtlRllxcktTVTdESXhBbVciLCJpYXQiOjE3NDYwOTUxMzh9._A6HAKo6exkBUTUXKq8gu7QrohahK1vRaQmdtuJ-BDY',
      },
    });

    return await fetchResponse.json();
  }

  async getStoryDetail(id) {
    const fetchResponse = await fetch(`${ENDPOINTS.ENDPOINT}/stories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLWtlRllxcktTVTdESXhBbVciLCJpYXQiOjE3NDYwOTUxMzh9._A6HAKo6exkBUTUXKq8gu7QrohahK1vRaQmdtuJ-BDY',
      },
    });
    return await fetchResponse.json();
  }

  async addStory(input, token) {
    // membuat FormData
    const formData = new FormData();
    formData.append('photo', input.photo instanceof Blob ? input.photo : new Blob([input.photo], { type: 'image/png' }));
    formData.append('description', input.description);
    formData.append('lon', input.lon);
    formData.append('lat', input.lat);

    try {
      const fetchResponse = await fetch(`${ENDPOINTS.ENDPOINT}/stories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })
        .catch((error) => {
          alert(error);
        });

      await fetchResponse.json();

      return window.location.href = '#/stories';
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menambahkan cerita tamu');
      return null;
    }

  }

  async addGuestStory(input) {
    // Membuat FormData
    const formData = new FormData();
    formData.append('photo', input.photo instanceof Blob ? input.photo : new Blob([input.photo], { type: 'image/png' }));
    formData.append('description', input.description);
    formData.append('lon', input.lon);
    formData.append('lat', input.lat);

    try {
      const fetchResponse = await fetch(`${ENDPOINTS.ENDPOINT}/stories/guest`, {
        method: 'POST',
        body: formData
      });

      if (!fetchResponse.ok) {
        throw new Error('Gagal menambahkan cerita tamu');
      }

      await fetchResponse.json();

      return window.location.href = '#/stories';
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menambahkan cerita tamu');
      return null;
    }
  }

  async authenticate(input) {
    const fetchResponse = await fetch(`${ENDPOINTS.ENDPOINT}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input)
    })
      .catch((error) => {
        alert(error);
      });

    const result = await fetchResponse.json();
    console.log(result)
    sessionStorage.setItem('token', result.loginResult.token);
    await result;

    return window.location.href = '#/stories';
  }

  async register(input) {
    const fetchResponse = await fetch(`${ENDPOINTS.ENDPOINT}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input)
    })
      .catch((error) => {
        alert(error);
      });

    const result = await fetchResponse.json();
    await result;
    console.log(result);

    return window.location.href = '#/stories';
  }

  async logout() {
    sessionStorage.removeItem('token');
  }
}
