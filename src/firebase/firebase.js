// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB_h1N0DTvW8eO9-2uyigpWKsRCJb5j8dw",
    authDomain: "todo-app-a2467.firebaseapp.com",
    projectId: "todo-app-a2467",
    storageBucket: "todo-app-a2467.appspot.com",
    messagingSenderId: "936325007868",
    appId: "1:936325007868:web:c79f22e0cdd56f40970a79",
    measurementId: "G-QMV8NBB0FR"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };