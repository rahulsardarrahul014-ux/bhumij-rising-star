// ================= IMPORTS =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getFirestore, addDoc, collection, getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// ================= CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyCVkJA8P1V0QkxwnxY6vgJ1wGGQw6Jp6lQ",
  authDomain: "bhumij-rising-star-e30ea.firebaseapp.com",
  projectId: "bhumij-rising-star-e30ea",
  storageBucket: "bhumij-rising-star-e30ea.firebasestorage.app",
  messagingSenderId: "161882531831",
  appId: "1:161882531831:web:cd981fcf9ed6a20e6570f2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// ================= LOGIN SYSTEM =================

// Signup
window.signup = async function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup Successful ✅");
  } catch (err) {
    alert(err.message);
  }
};

// Login
window.login = async function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful ✅");
  } catch (err) {
    alert(err.message);
  }
};

// Logout
window.logout = async function () {
  await signOut(auth);
  alert("Logged Out ✅");
};


// ================= PAGE LOAD =================
document.addEventListener("DOMContentLoaded", () => {

  // REGISTRATION FORM
  const form = document.getElementById("registerForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const category = document.getElementById("category").value;

      try {
        await addDoc(collection(db, "users"), {
          name, email, phone, category
        });

        alert("Registration Successful ✅");
        form.reset();

      } catch (err) {
        alert(err.message);
      }
    });
  }

  // LOAD VIDEOS
  loadVideos();
  const data = doc.data();
  if (data.approved !== true) return;
});


// ================= SAVE YOUTUBE VIDEO =================
window.saveVideo = async function () {
  const title = document.getElementById("videoTitle").value;
  const category = document.getElementById("videoCategory").value;
  const link = document.getElementById("youtubeLink").value;

  if (!link.includes("youtube") && !link.includes("youtu.be")) {
    alert("Valid YouTube link dalo");
    return;
  }

  try {
    await addDoc(collection(db, "videos"), {
      title,
      category,
      link,
      approved: false, 
      time: new Date()
    });

    alert("Video Uploaded ✅");

  } catch (err) {
    alert(err.message);
  }
};


// ================= SHOW VIDEOS =================
async function loadVideos() {
  const container = document.getElementById("videoList");

  if (!container) return;

  container.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "videos"));

  querySnapshot.forEach(doc => {
    const data = doc.data();

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
export { db };