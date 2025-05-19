// src/firebase/config.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAxoOZZUjs_2N5PqdtXtA2qjdrBkBw24z8",
    authDomain: "tyre-management-system-c9fe9.firebaseapp.com",
    projectId: "tyre-management-system-c9fe9",
    storageBucket: "tyre-management-system-c9fe9.firebasestorage.app",
    messagingSenderId: "438721729726",
    appId: "1:438721729726:web:74df11ceb5e3f9ecba3aef",
    measurementId: "G-9Q9V63ZY5P"
  };

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
