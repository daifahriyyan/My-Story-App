import { openDB } from 'idb';

const DATABASE_NAME = 'myStory';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'saved-reports';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade: (database) => {
    database.createObjectStore(OBJECT_STORE_NAME, {
      keyPath: 'id',
    })
  }
})

export const addBookmark = async (data) => {
  (await dbPromise).add(OBJECT_STORE_NAME, data);
}

export const getAllBookmark = async () => {
  return (await dbPromise).getAll(OBJECT_STORE_NAME);
}

export const deleteBookmark = async (id) => {
  console.log('Deleting ID:', id);
  return (await dbPromise).delete(OBJECT_STORE_NAME, id)
}

const Database = {
  async putReport(report) {
    if (!Object.hasOwn(report, 'id')) {
      throw new Error('`id` is required to save.');
    }

    return (await dbPromise).put(OBJECT_STORE_NAME, report);
  }
}

export default Database;