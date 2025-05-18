self.addEventListener('push', event => {
  console.log('Service worker pushing...');

  event.waitUntil(
    self.registration.showNotification('Ada Story Baru!', {
      body: 'Seseorang baru saja menambahkan cerita!',
    })
  );
});