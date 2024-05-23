import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: 'AIzaSyB1tTTCOAEwJ5mprETjBoBzzcV0r4Mn8zA',
//   authDomain: 'wheeltalk-j.firebaseapp.com',
//   projectId: 'wheeltalk-j',
//   storageBucket: 'wheeltalk-j.appspot.com',
//   messagingSenderId: '90978838122',
//   appId: '1:90978838122:web:0ec73a8c83b0688d18cc13',
// };

const firebaseConfig = {
  apiKey: 'AIzaSyBZwGFhLq4PJatA6TTHCvIgTnvdLGtUWCo',
  authDomain: 'wheeltalk-test.firebaseapp.com',
  projectId: 'wheeltalk-test',
  storageBucket: 'wheeltalk-test.appspot.com',
  messagingSenderId: '767690510077',
  appId: '1:767690510077:web:2da57534c3d9b94f2e7894',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
