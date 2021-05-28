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
  deletePages(userId, pageId) {
    firebaseDatabase.ref(`${userId}pages/${pageId}`).remove();
  }
  readPages(userId, setPages) {
    const nemosRef = firebaseDatabase.ref(`${userId}/pages`);
    nemosRef.on('value', (snapshot) => {
      snapshot.val() && setPages(snapshot.val());
      // console.log('read');
    });
    return () => nemosRef.off();
  }
  setArr(userId, selected, arr) {
    firebaseDatabase.ref(`${userId}/pages/${selected}/order`).set(arr);
  }
  readArr(userId, selected, setOrder) {
    const nemosRef = firebaseDatabase.ref(`${userId}/pages/${selected}/order`);
    nemosRef.on('value', (snapshot) => {
      console.log(snapshot.val());
      snapshot.val() ? setOrder(snapshot.val()) : setOrder([]);
    });
    return () => nemosRef.off();
  }
}

export default DbService;
