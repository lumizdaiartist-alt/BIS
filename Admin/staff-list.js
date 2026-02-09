import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    limit,
    startAfter,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAibPUdGjS0PrpyssRFQVAPO-3BLpV-IaE",
  authDomain: "school-management-40c35.firebaseapp.com",
  projectId: "school-management-40c35",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, user=>{
    if(!user) location.href="../index.html";
});

const table = document.getElementById("staffTable");
const empty = document.getElementById("emptyState");

const modal = document.getElementById("editModal");
const saveEdit = document.getElementById("saveEdit");

const editName = document.getElementById("editName");
const editSubject = document.getElementById("editSubject");
const editClass = document.getElementById("editClass");
const editPhone = document.getElementById("editPhone");

let editingId = null;
let lastDoc = null;
const PAGE_SIZE = 5;

async function loadStaff(){
    table.innerHTML = "";
    empty.style.display="none";

    const q = query(
        collection(db,"teachers"),
        orderBy("name"),
        limit(PAGE_SIZE)
    );

    const snap = await getDocs(q);

    if(snap.empty){
        empty.style.display="block";
        return;
    }

    lastDoc = snap.docs[snap.docs.length-1];

    snap.forEach(docSnap=>{
        const d = docSnap.data();

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${d.name}</td>
            <td>${d.subject}</td>
            <td>${d.class}</td>
            <td>${d.phone}</td>
            <td class="actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </td>
        `;

        tr.querySelector(".edit").onclick = ()=>{
            editingId = docSnap.id;
            editName.value = d.name;
            editSubject.value = d.subject;
            editClass.value = d.class;
            editPhone.value = d.phone;
            modal.classList.add("show");
        };

        tr.querySelector(".delete").onclick = async()=>{
            if(confirm("Delete this teacher?")){
                await deleteDoc(doc(db,"teachers",docSnap.id));
                loadStaff();
            }
        };

        table.appendChild(tr);
    });
}

saveEdit.onclick = async()=>{
    if(!editingId) return;

    await updateDoc(doc(db,"teachers",editingId),{
        name: editName.value,
        subject: editSubject.value,
        class: editClass.value,
        phone: editPhone.value
    });

    modal.classList.remove("show");
    loadStaff();
};

modal.onclick = e=>{
    if(e.target === modal){
        modal.classList.remove("show");
    }
};

// INITIAL LOAD (ONLY ONCE)
loadStaff();