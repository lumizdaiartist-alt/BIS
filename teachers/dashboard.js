/* =====================
   FIREBASE CONFIG
   ===================== */

const firebaseConfig = {
  apiKey: "AIzaSyAibPUdGjS0PrpyssRFQVAPO-3BLpV-IaE",
  authDomain: "school-management-40c35.firebaseapp.com",
  projectId: "school-management-40c35",
  storageBucket: "school-management-40c35.firebasestorage.app",
  messagingSenderId: "314212845618",
  appId: "1:314212845618:web:21f9dc296501841dab542b",
  measurementId: "G-QZ83Z8PLSQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();

/* =====================
   AUTH & WELCOME MESSAGE
   ===================== */

auth.onAuthStateChanged(user => {
  if (user) {
    const displayName =
      user.displayName ||
      user.email?.split("@")[0] ||
      "Teacher";

    document.getElementById("welcomeUser").innerText =
      `Welcome, ${displayName}`;
  } else {
    // Redirect if not logged in
    window.location.href = "login.html";
  }
});

/* =====================
   FLOATING BUTTON & MODAL
   ===================== */

const fab = document.getElementById("fab");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

fab.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

/* =====================
   NAVIGATION ACTIVE STATE
   ===================== */

const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
});