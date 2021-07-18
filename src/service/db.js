import { firebaseDatabase } from './firebase';

class DbService {
  addNemo(userId, pageId, nemoId, contents) {
    firebaseDatabase.ref(`${userId}/pages/${pageId}/nemos/${nemoId}`).set(contents);
  }
  deleteNemo(userId, pageId, nemoId) {
    firebaseDatabase.ref(`${userId}/pages/${pageId}/nemos/${nemoId}`).remove();
  }
  addPages(userId, pageId, pageFormat) {
    firebaseDatabase.ref(`${userId}/pages/${pageId}`).set(pageFormat);
  }
  setPages(userId, newPages) {
    firebaseDatabase.ref(`${userId}/pages/`).set(newPages);
  }
  deletePages(userId, pageId) {
    firebaseDatabase.ref(`${userId}/pages/${pageId}`).remove();
  }
  readPages(userId, setPages) {
    const nemosRef = firebaseDatabase.ref(`${userId}/pages`);
    nemosRef.on('value', (snapshot) => {
      snapshot.val() && setPages(snapshot.val());
    });
    return () => nemosRef.off();
  }
  setOrder(userId, selected, arr) {
    firebaseDatabase.ref(`${userId}/pages/${selected}/order`).set(arr);
  }
  readOrder(userId, selected, setOrder) {
    const nemosRef = firebaseDatabase.ref(`${userId}/pages/${selected}/order`);
    nemosRef.on('value', (snapshot) => {
      snapshot.val() ? setOrder(snapshot.val()) : setOrder([]);
    });
    return () => nemosRef.off();
  }
  setTheme(userId, boolean) {
    firebaseDatabase.ref(`${userId}/darkTheme`).set(boolean);
  }
  readTheme(userId, setDarkTheme) {
    const themeRef = firebaseDatabase.ref(`${userId}/darkTheme`);
    themeRef.on('value', (snapshot) => {
      snapshot.val() !== undefined && setDarkTheme(snapshot.val());
    });
    return () => themeRef.off();
  }
}

export default DbService;
