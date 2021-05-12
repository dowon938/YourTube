import { firebaseDatabase } from './firebase';

class DbService {
  addCard(userId, cardId, cards) {
    firebaseDatabase.ref(`${userId}/cards/${cardId}`).set(cards);
  }
  deleteCard(userId, cardId) {
    firebaseDatabase.ref(`${userId}/cards/${cardId}`).remove();
  }
  readCards(userId, setCards) {
    const cardsRef = firebaseDatabase.ref(`${userId}/cards`);
    cardsRef.on('value', (snapshot) => {
      // const data = snapshot.val();
      // updateStarCount(postElement, data);
      // console.log(userId);
      snapshot.val() && setCards(snapshot.val());
    });
    return () => cardsRef.off();
  }
}

export default DbService;
