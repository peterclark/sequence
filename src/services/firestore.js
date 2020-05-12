import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { startCase, lowerCase } from "lodash";

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

export const startGame = (userId, userName) => {
  userName = startCase(lowerCase(userName));
  return db.collection("games").add({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: userId,
    players: {
      [userId]: { id: userId, name: userName, active: true },
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

export const placeToken = (gameId, [x, y], team) => {
  return db
    .collection("games")
    .doc(gameId)
    .update({ [`board.${x}.${y}`]: team });
};
