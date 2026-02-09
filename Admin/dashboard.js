// 🔥 Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAibPUdGjS0PrpyssRFQVAPO-3BLpV-IaE",
  authDomain: "school-management-40c35.firebaseapp.com",
  projectId: "school-management-40c35",
  storageBucket: "school-management-40c35.firebasestorage.app",
  messagingSenderId: "314212845618",
  appId: "1:314212845618:web:21f9dc296501841dab542b",
  measurementId: "G-QZ83Z8PLSQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================= AUTH GUARD ================= */
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "../index.html";
});

/* ================= DOM READY ================= */
document.addEventListener("DOMContentLoaded", () => {

  /* STUDENT COUNT */
  onSnapshot(collection(db, "students"), snap => {
    document.getElementById("studentCount").innerText = snap.size;
  });

  /* TEACHER COUNT */
  onSnapshot(collection(db, "teachers"), snap => {
    document.getElementById("teacherCount").innerText = snap.size;
  });

  /* ANNOUNCEMENTS (ALERTS TAB) */
  const announcementList = document.getElementById("announcementList");

  const q = query(
    collection(db, "announcements"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, snapshot => {
    announcementList.innerHTML = "";

    if (snapshot.empty) {
      announcementList.innerHTML = `
        <div class="empty">
          <span class="material-icons-outlined">campaign</span>
          <p>No announcements yet</p>
        </div>`;
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();

      announcementList.innerHTML += `
        <div class="announcement-card">
          <h4>${data.title}</h4>
          <p>${data.message}</p>
          <span class="date">
            ${data.createdAt?.toDate().toLocaleString() || ""}
          </span>
        </div>`;
    });
  });

  /* TAB NAV */
  document.querySelectorAll(".nav-item").forEach(item => {
    item.onclick = () => {
      document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      item.classList.add("active");
      document.getElementById(item.dataset.tab).classList.add("active");
    };
  });

  /* MODAL */
  const modal = document.getElementById("modal");
  document.getElementById("openModal").onclick = () => modal.classList.add("show");
  document.getElementById("closeModal").onclick = () => modal.classList.remove("show");

  /* PROFILE EDIT */
  const editBtn = document.getElementById("editProfile");
  const adminName = document.getElementById("adminName");

  editBtn.onclick = () => {
    const editing = adminName.isContentEditable;
    adminName.contentEditable = !editing;
    editBtn.innerText = editing ? "Edit Profile" : "Save Changes";
  };

  /* DARK MODE */
  const darkToggle = document.getElementById("darkToggle");

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
    darkToggle.checked = true;
  }

  darkToggle.onchange = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
  };

});