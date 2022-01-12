import firebase from 'firebase';
require('@firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyA3FNnKvpXjdIk8dCcCuD8Be7VXqQnhG2Y",
    authDomain: "e-library-718dc.firebaseapp.com",
    projectId: "e-library-718dc",
    storageBucket: "e-library-718dc.appspot.com",
    messagingSenderId: "348660272273",
    appId: "1:348660272273:web:1bfae0c5003c0ffec7c330"
  };

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();