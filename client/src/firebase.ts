// Firebase konfiguracija i inicijalizacija
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Tvoji stvarni Firebase podaci
const firebaseConfig = {
  apiKey: 'AIzaSyBVYCLu7bXDVFKZiTO1Qxm5FnnPN53sXPI',
  authDomain: 'putovanja-e2d59.firebaseapp.com',
  projectId: 'putovanja-e2d59',
  storageBucket: 'putovanja-e2d59.firebasestorage.app',
  messagingSenderId: '146704730436',
  appId: '1:146704730436:web:02d09865dd5b4492452f11',
  measurementId: 'G-LSM2YLCB2F',
};

// Inicijaliziramo Firebase
const app = initializeApp(firebaseConfig);

// Auth i Analytics exportamo za korištenje u Reactu
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
