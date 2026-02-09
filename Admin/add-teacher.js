import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* 🔥 CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyAibPUdGjS0PrpyssRFQVAPO-3BLpV-IaE",
  authDomain: "school-management-40c35.firebaseapp.com",
  projectId: "school-management-40c35",
  storageBucket: "school-management-40c35.firebasestorage.app",
  messagingSenderId: "314212845618",
  appId: "1:314212845618:web:21f9dc296501841dab542b"
};

// MAIN APP (ADMIN)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// SECONDARY APP (FOR TEACHER CREATION)
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

/* 🔐 AUTH GUARD */
onAuthStateChanged(auth, user => {
    if (!user) {
        window.location.href = "../index.html";
    }
});

// ELEMENTS
const btn = document.getElementById("saveTeacher");
const successMsg = document.getElementById("successMsg");

const teacherName = document.getElementById("teacherName");
const teacherPhone = document.getElementById("teacherPhone");
const teacherEmail = document.getElementById("teacherEmail");
const teacherPassword = document.getElementById("teacherPassword");
const teacherSubject = document.getElementById("teacherSubject");
const teacherClass = document.getElementById("teacherClass");

btn.addEventListener("click", async () => {

    const name = teacherName.value.trim();
    const phone = teacherPhone.value.trim();
    const email = teacherEmail.value.trim();
    const password = teacherPassword.value.trim();
    const subject = teacherSubject.value.trim();
    const assignedClass = teacherClass.value;

    if (!name || !phone || !email || !password || !subject || !assignedClass) {
        alert("Please fill all fields");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    try {
        btn.disabled = true;
        btn.innerText = "Creating Teacher...";

        // ✅ CREATE AUTH USER
        const userCred = await createUserWithEmailAndPassword(
            secondaryAuth,
            email,
            password
        );

        const uid = userCred.user.uid;

        // ✅ SAVE TEACHER PROFILE
        await setDoc(doc(db, "teachers", uid), {
            uid,
            name,
            phone,
            email,
            subject,
            class: assignedClass,
            role: "teacher",
            createdAt: serverTimestamp()
        });

        successMsg.innerText = "Teacher created successfully ✅";

        // CLEAR FORM
        document.querySelectorAll("input").forEach(i => i.value = "");
        teacherClass.selectedIndex = 0;

    } catch (err) {
        console.error(err);
        alert(err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "Add Teacher";

        setTimeout(() => successMsg.innerText = "", 3000);
    }
});