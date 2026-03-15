// ======= FIREBASE INIT =======
const firebaseConfig = {
  apiKey: "AIzaSyAzyMeN9ajh5Nr7zEpxDM75LRvdUrpbA4g",
  authDomain: "new-year-70487.firebaseapp.com",
  projectId: "new-year-70487",
  storageBucket: "new-year-70487.firebasestorage.app",
  messagingSenderId: "965336773786",
  appId: "1:965336773786:web:4226d72bcc2639e9cb5b23",
  measurementId: "G-PRNQ5BQPLC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
window.db = db;
console.log("Firebase initialized:", window.db);
