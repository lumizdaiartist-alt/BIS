import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// 🔥 YOUR CONFIG (already saved)
const firebaseConfig = {
  apiKey: "AIzaSyAibPUdGjS0PrpyssRFQVAPO-3BLpV-IaE",
  authDomain: "school-management-40c35.firebaseapp.com",
  projectId: "school-management-40c35",
  storageBucket: "school-management-40c35.firebasestorage.app",
  messagingSenderId: "314212845618",
  appId: "1:314212845618:web:21f9dc296501841dab542b",
  measurementId: "G-QZ83Z8PLSQ"
};


// ✅ INITIALIZE ONCE (VERY IMPORTANT)
const app = initializeApp(firebaseConfig);


// ✅ EXPORT THESE
export const db = getFirestore(app);
export const auth = getAuth(app);