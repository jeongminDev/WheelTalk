import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB1tTTCOAEwJ5mprETjBoBzzcV0r4Mn8zA',
  authDomain: 'wheeltalk-j.firebaseapp.com',
  projectId: 'wheeltalk-j',
  storageBucket: 'wheeltalk-j.appspot.com',
  messagingSenderId: '90978838122',
  appId: '1:90978838122:web:0ec73a8c83b0688d18cc13',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
