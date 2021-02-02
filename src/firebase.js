import firebase from "firebase"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAGDIc3CTS89JS_yVjj7VevifAIi1s22I4",
    authDomain: "fusfus-fd4e4.firebaseapp.com",
    projectId: "fusfus-fd4e4",
    storageBucket: "fusfus-fd4e4.appspot.com",
    messagingSenderId: "152524815027",
    appId: "1:152524815027:web:3df35efa13714dce918ec6",
    measurementId: "G-HX0D1H16BH"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

export {auth,provider};
export default db;

