import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAibPUdGjS0PrpyssRFQVAPO-3BLpV-IaE",
  authDomain: "school-management-40c35.firebaseapp.com",
  projectId: "school-management-40c35",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// 🔐 AUTH GUARD
onAuthStateChanged(auth, user=>{
    if(!user){
        location.href="../index.html";
    }
});


// DOM
const postBtn = document.getElementById("postBtn");
const successMsg = document.getElementById("successMsg");

postBtn.onclick = async ()=>{

    const title = document.getElementById("title").value.trim();
    const message = document.getElementById("message").value.trim();
    const audience = document.getElementById("audience").value;

    if(!title || !message){
        alert("Please fill all fields");
        return;
    }

    try{

        postBtn.classList.add("loading");
        postBtn.innerText = "Posting...";

        await addDoc(collection(db,"announcements"),{

            title,
            message,
            audience,
            createdAt: serverTimestamp(),
            postedBy: auth.currentUser.uid

        });

        successMsg.innerText = "✅ Announcement posted successfully.";

        document.getElementById("title").value="";
        document.getElementById("message").value="";

        postBtn.classList.remove("loading");
        postBtn.innerText="Post Announcement";

    }catch(err){

        console.error(err);
        alert("Failed to post announcement");

        postBtn.classList.remove("loading");
        postBtn.innerText="Post Announcement";
    }

};