import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { startCase, lowerCase, join, flatten, shuffle, remove } from "lodash";

const SUITS = ["♣", "♦", "♥", "♠"];
const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, "T", "J", "Q", "K", "A"];
const CARDS = flatten(
  SUITS.map((suit) => RANKS.map((rank) => join([rank, suit], "")))
);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export const authenticateAnonymously = () => {
  return firebase.auth().signInAnonymously();
};

export const createGame = (userId, userName) => {
  userName = startCase(lowerCase(userName));
  return db.collection("games").add({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: userId,
    players: {
      [userId]: { id: userId, name: userName },
    },
  });
};

export const joinGame = (gameId, userId, userName) => {
  userName = startCase(lowerCase(userName));
  return db
    .collection("games")
    .doc(gameId)
    .update({
      [`players.${userId}.id`]: userId,
      [`players.${userId}.name`]: userName,
    });
};

export const subscribeToGame = (gameId, callback) => {
  return db
    .collection("games")
    .doc(gameId)
    .onSnapshot((doc) => callback(doc.data()));
};

export const getGame = (gameId) => {
  return db.collection("games").doc(gameId).get();
};

export const takeSeat = (gameId, userId, position, team) => {
  return db
    .collection("games")
    .doc(gameId)
    .update({
      [`players.${userId}.position`]: position,
      [`players.${userId}.team`]: team,
    });
};

export const startGame = (gameId, players) => {
  const cards = shuffle([...CARDS, ...CARDS]);
  const game = {
    isActive: true,
    cards: cards,
  };
  shuffle(players).forEach((player, index) => {
    const playerPath = `players.${player.id}`;
    const hand = remove(cards, (card, index) => index < 5);
    if (index === 0) game[`${playerPath}.isActive`] = true;
    game[`${playerPath}.cards`] = hand;
  });
  return db.collection("games").doc(gameId).update(game);
};

export const placeToken = (gameId, [x, y], team) => {
  return db
    .collection("games")
    .doc(gameId)
    .update({ [`board.${x}.${y}`]: team });
};

export const removeToken = (gameId, [x, y]) => {
  return db
    .collection("games")
    .doc(gameId)
    .update({
      [`board.${x}.${y}`]: firebase.firestore.FieldValue.delete(),
    });
};
