import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCYLOOFxfw9H1vo5VO5kvIRBWWuMrQoM9k",
  authDomain: "quizup-158e7.firebaseapp.com",
  projectId: "quizup-158e7",
  storageBucket: "quizup-158e7.appspot.com",
  messagingSenderId: "135897943957",
  appId: "1:135897943957:web:f9321882b31cdb8e5d309c",
  measurementId: "G-1X7BM34770"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export default firebase;