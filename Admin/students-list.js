import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    onSnapshot,
    deleteDoc,
    doc,
    updateDoc,
    query,
    limit,
    startAfter
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* 🔥 CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyAibPUdGjS0PrpyssRFQVAPO-3BLpV-IaE",
  authDomain: "school-management-40c35.firebaseapp.com",
  projectId: "school-management-40c35",
  storageBucket: "school-management-40c35.firebasestorage.app",
  messagingSenderId: "314212845618",
  appId: "1:314212845618:web:21f9dc296501841dab542b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/* 🔐 AUTH */
onAuthStateChanged(auth, user=>{
    if(!user) window.location.href="../index.html";
});

/* STATE */
const container = document.getElementById("studentsContainer");
const searchInput = document.getElementById("searchInput");
const classFilter = document.getElementById("classFilter");
const emptyState = document.getElementById("emptyState");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const editModal = document.getElementById("editModal");
const editName = document.getElementById("editName");
const editClass = document.getElementById("editClass");
const editParent = document.getElementById("editParent");
const saveEdit = document.getElementById("saveEdit");

let students = [];
let currentPage = 0;
const PAGE_SIZE = 5;
let editingId = null;

/* REALTIME FETCH */
onSnapshot(collection(db,"students"), snap=>{
    students = snap.docs.map(d=>({ id:d.id, ...d.data() }));
    buildClassFilter();
    render();
});

/* CLASS FILTER */
function buildClassFilter(){
    const classes = [...new Set(students.map(s=>s.class))];
    classFilter.innerHTML = `<option value="">All Classes</option>`;
    classes.forEach(c=>{
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        classFilter.appendChild(opt);
    });
}

/* RENDER WITH PAGINATION */
function render(){
    let filtered = students.filter(s =>
        s.name.toLowerCase().includes(searchInput.value.toLowerCase()) &&
        (classFilter.value === "" || s.class === classFilter.value)
    );

    emptyState.style.display = filtered.length ? "none" : "block";

    const start = currentPage * PAGE_SIZE;
    const pageData = filtered.slice(start, start + PAGE_SIZE);

    container.innerHTML = "";

    pageData.forEach(s=>{
        const card = document.createElement("div");
        card.className = "student-card";
        card.innerHTML = `
            <h4>${s.name}</h4>
            <p><b>Class:</b> ${s.class}</p>
            <p><b>Parent:</b> ${s.parentPhone}</p>
            <div class="card-actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;

        card.querySelector(".edit").onclick = ()=>{
            editingId = s.id;
            editName.value = s.name;
            editClass.value = s.class;
            editParent.value = s.parentPhone;
            editModal.classList.add("show");
        };

        card.querySelector(".delete").onclick = async ()=>{
            if(confirm("Delete student?")){
                await deleteDoc(doc(db,"students",s.id));
            }
        };

        container.appendChild(card);
    });
}

/* EDIT SAVE */
saveEdit.onclick = async ()=>{
    await updateDoc(doc(db,"students",editingId),{
        name: editName.value,
        class: editClass.value,
        parentPhone: editParent.value
    });
    editModal.classList.remove("show");
};

/* EVENTS */
searchInput.oninput = ()=>{ currentPage=0; render(); };
classFilter.onchange = ()=>{ currentPage=0; render(); };
nextBtn.onclick = ()=>{ currentPage++; render(); };
prevBtn.onclick = ()=>{ if(currentPage>0) currentPage--; render(); };
editModal.onclick = e=>{ if(e.target===editModal) editModal.classList.remove("show"); };