import { createApp } from 'vue';
import App from './App.vue';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import './assets/style.css';

const firebaseConfig = {
  apiKey: "AIzaSyDucIBPkjWk-TBOF0t9Az4OiKauH856PKY",
  authDomain: "ua92-mb-todolist.firebaseapp.com",
  projectId: "ua92-mb-todolist",
  storageBucket: "ua92-mb-todolist.appspot.com",
  messagingSenderId: "549818011492",
  appId: "1:549818011492:web:30c0931469cc413e363471",
  measurementId: "G-YSFDNXBGTY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);


createApp(App).mount('#app');
