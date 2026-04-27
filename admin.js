// ================= IMPORTS =================
import { db } from "./firebase.js";

import { 
  getAuth, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  getDocs, collection, updateDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const auth = getAuth();

const ADMIN_EMAIL = "rahulsardarrahul014@gmail.com"; // ✅ correct

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Login required ❌");
    window.location.href = "index.html";
  } 
  else if (user.email !== ADMIN_EMAIL) {
    alert("Access Denied ❌ (Admin only)");
    window.location.href = "index.html";
  } 
  else {
    loadAdminVideos();
  }
});


// ================= LOAD VIDEOS =================
async function loadAdminVideos() {
  const container = document.getElementById("adminVideos");

  if (!container) return;

  container.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "videos"));

  querySnapshot.forEach((item) => {
    const data = item.data();
    const id = item.id;

    let videoId = "";

    if (data.link.includes("v=")) {
      videoId = data.link.split("v=")[1].split("&")[0];
    } else if (data.link.includes("youtu.be")) {
      videoId = data.link.split("youtu.be/")[1];
    }

    container.innerHTML += `
      <div style="margin:20px; padding:10px; border:1px solid #ccc;">
        <h3>${data.title}</h3>
        <p>${data.category}</p>

        <iframe width="300" height="200"
        src="https://www.youtube.com/embed/${videoId}"
        allowfullscreen></iframe>

        <br><br>

        <button onclick="approveVideo('${id}')">✅ Approve</button>
        <button onclick="rejectVideo('${id}')">❌ Reject</button>
      </div>
    `;
  });
}


// ================= APPROVE =================
window.approveVideo = async function(id) {
  const ref = doc(db, "videos", id);

  await updateDoc(ref, {
    approved: true
  });

  alert("Approved ✅");
  loadAdminVideos();
};


// ================= REJECT =================
window.rejectVideo = async function(id) {
  const ref = doc(db, "videos", id);

  await updateDoc(ref, {
    approved: false
  });

  alert("Rejected ❌");
  loadAdminVideos();
};