import { getDocs, collection } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase.js"; // ❗ important export hona chahiye

async function loadVideos() {
  const container = document.getElementById("videoList");
  container.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "videos"));

  querySnapshot.forEach(doc => {
    const data = doc.data();

    // 🔥 ONLY APPROVED VIDEO SHOW
    if (data.approved !== true) return;

    let videoId = "";

    if (data.link.includes("v=")) {
      videoId = data.link.split("v=")[1].split("&")[0];
    } else if (data.link.includes("youtu.be")) {
      videoId = data.link.split("youtu.be/")[1];
    }

    container.innerHTML += `
      <div style="margin:20px; background:#fff; padding:10px; border-radius:10px;">
        <h3>${data.title}</h3>
        <p>${data.category}</p>

        <iframe width="100%" height="250"
        src="https://www.youtube.com/embed/${videoId}"
        frameborder="0" allowfullscreen></iframe>
      </div>
    `;
  });
}

window.addEventListener("DOMContentLoaded", loadVideos);