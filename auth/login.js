import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
    getAuth, 
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAibPUdGjS0PrpyssRFQVAPO-3BLpV-IaE",
  authDomain: "school-management-40c35.firebaseapp.com",
  projectId: "school-management-40c35",
  storageBucket: "school-management-40c35.firebasestorage.app",
  messagingSenderId: "314212845618",
  appId: "1:314212845618:web:21f9dc296501841dab542b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let redirecting = false; // prevents double redirect



/* 🚀 ROLE REDIRECTION */
async function redirectUser(user){

    if(redirecting) return;
    redirecting = true;

    try{

        const adminSnap = await getDoc(doc(db, "admins", user.uid));
        const teacherSnap = await getDoc(doc(db, "teachers", user.uid));

        // ✅ ADMIN
        if(adminSnap.exists()){
            window.location.href = "../Admin/dashboard.html";
            return;
        }

        // ✅ TEACHER
        if(teacherSnap.exists()){
            window.location.href = "../teachers/dashboard.html";
            return;
        }

        alert("Account has no role assigned.");
        redirecting = false;

    }catch(err){

        console.error("ROLE CHECK ERROR:", err);
        alert("Unable to verify user role.");
        redirecting = false;
    }
}



/* 🔐 LOGIN BUTTON */
document.getElementById("loginBtn").addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("error");

    error.innerText = "";

    if(!email || !password){
        error.innerText = "Please enter email and password";
        return;
    }

    try{

        const cred = await signInWithEmailAndPassword(auth, email, password);

        // ✅ Redirect ONLY after manual login
        await redirectUser(cred.user);

    }catch(err){

        console.error("LOGIN ERROR:", err);

        if(err.code === "auth/user-not-found"){
            error.innerText = "No account found for this email.";
        }
        else if(err.code === "auth/wrong-password"){
            error.innerText = "Incorrect password.";
        }
        else{
            error.innerText = "Login failed. Try again.";
        }
    }
});