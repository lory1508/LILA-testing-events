// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWrHgSiqyYi05-4QGzvbbXt1H2qDembM0",
  authDomain: "testing-lila-be.firebaseapp.com",
  projectId: "testing-lila-be",
  storageBucket: "testing-lila-be.appspot.com",
  messagingSenderId: "50999869971",
  appId: "1:50999869971:web:e74c4beb5a4abcd374b5e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    db
}