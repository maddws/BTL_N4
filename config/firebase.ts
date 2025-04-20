// // @/config/firebase.ts
// // ---------------------------------------------------
// // import firebase from '@react-native-firebase/app';
// // import '@react-native-firebase/auth';
// // import '@react-native-firebase/firestore';

import { initializeApp } from 'firebase/app';
import { getFirestore }  from 'firebase/firestore';
import { getAuth }       from 'firebase/auth';

// const firebaseConfig = { /* your config */ };
const firebaseConfig = {
  apiKey: 'AIzaSyC01AUrFvV90eFLOo86k3MVOHU0CN8YODI',
  authDomain: 'petcare-db.firebaseapp.com',
  projectId: 'petcare-db',
  storageBucket: 'petcare-db.firebasestorage.app',
  messagingSenderId: '550103698081',
  appId: '1:550103698081:android:bf707eb52b54c8638a3ee0',
  databaseURL:
    'https://petcare-db-default-rtdb.asia-southeast1.firebasedatabase.app',
};
const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
// import { initializeApp } from 'firebase/app';
// import { getFirestore }  from 'firebase/firestore';
// import { getAuth }       from 'firebase/auth';


// // // ⚠️  Với build native bạn *có thể* bỏ hẳn firebaseConfig.
// // //     Nhưng nếu còn chạy Web/Expo Go hoặc cần đa‑app thì giữ lại.

// // let app: {};

// // // Chỉ khởi tạo duy nhất 1 lần
// // if (!firebase.apps.length) {
// //   app = firebase.initializeApp(firebaseConfig);
// // } else {
// //   app = firebase.app();
// // }

// // /* -------------------------------------------------- */
// // /* Các service muốn dùng                              */
// // const auth = firebase.auth();          // đăng nhập/đăng ký
// // const db   = firebase.firestore();     // truy vấn dữ liệu
// // /* -------------------------------------------------- */

// // // 👉 Export tuỳ mục đích
// // export { app, auth, db };
// // export default firebase;


// src/config/firebase.ts
// Sử dụng Firebase Web SDK với persistence cho React Native (Expo Go)

// import { initializeApp } from 'firebase/app';
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Cấu hình dự án Firebase của bạn
// const firebaseConfig = {
//   apiKey: 'AIzaSyC01AUrFvV90eFLOo86k3MVOHU0CN8YODI',
//   authDomain: 'petcare-db.firebaseapp.com',
//   projectId: 'petcare-db',
//   storageBucket: 'petcare-db.firebasestorage.app',
//   messagingSenderId: '550103698081',
//   appId: '1:550103698081:android:bf707eb52b54c8638a3ee0',
//   databaseURL: 'https://petcare-db-default-rtdb.asia-southeast1.firebasedatabase.app',
// };

// // Khởi tạo ứng dụng Firebase
// export const app = initializeApp(firebaseConfig);

// // Khởi tạo Auth với persistence sử dụng AsyncStorage
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

// // Khởi tạo Firestore
// export const db = getFirestore(app);

// src/config/firebase.ts
// —————————————————————————————————————————————————————
// Firebase Web SDK (modular) + Auth persistence in Expo Go
// —————————————————————————————————————————————————————

// src/config/firebase.ts
// —————————————————————————————————————————————————————
// Firebase Web SDK (modular) + Auth persistence in Expo Go
// —————————————————————————————————————————————————————

// import { initializeApp } from 'firebase/app';
// import {
//   initializeAuth,
// //   getReactNativePersistence
// } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // 1) Your Firebase project configuration:
// const firebaseConfig = {
//   apiKey:            'AIzaSyC01AUrFvV90eFLOo86k3MVOHU0CN8YODI',
//   authDomain:        'petcare-db.firebaseapp.com',
//   projectId:         'petcare-db',
//   storageBucket:     'petcare-db.firebasestorage.app',
//   messagingSenderId: '550103698081',
//   appId:             '1:550103698081:android:bf707eb52b54c8638a3ee0',
//   databaseURL:       'https://petcare-db-default-rtdb.asia-southeast1.firebasedatabase.app'
// };

// // 2) Initialize the core Firebase app
// export const app = initializeApp(firebaseConfig);

// // 3) Initialize Auth with AsyncStorage persistence
// export const auth = initializeAuth(app, {
// //   persistence: getReactNativePersistence(AsyncStorage)
// });

// // 4) Initialize Cloud Firestore
// export const db = getFirestore(app);
