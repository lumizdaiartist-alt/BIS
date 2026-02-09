// ✅ import db + auth from init
import { db, auth } from "../firebase-init.js";

// ✅ IMPORT FIRESTORE FUNCTIONS
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// 🔐 AUTH GUARD
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "../index.html";
    }

});


// ✅ WAIT FOR PAGE
document.addEventListener("DOMContentLoaded", () => {

    const saveBtn = document.getElementById("saveStudent");

    saveBtn.addEventListener("click", async () => {

        const name = document.getElementById("name").value.trim();
        const studentClass = document.getElementById("class").value;
        const parentPhone = document.getElementById("phone").value.trim();
        const studentId = document.getElementById("studentId").value.trim();

        if (!name || !studentClass || !parentPhone) {
            alert("Fill all fields");
            return;
        }

        try {

            saveBtn.textContent = "Saving...";
            saveBtn.disabled = true;

            await addDoc(collection(db, "students"), {

                name,
                class: studentClass,
                parentPhone,
                studentId: studentId || "AUTO",
                createdAt: serverTimestamp()

            });

            alert("Student Added ✅");

        } catch (error) {

            console.error(error);
            alert(error.message);

        } finally {

            saveBtn.textContent = "Save Student";
            saveBtn.disabled = false;
        }

    });

});