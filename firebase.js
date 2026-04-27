// ================= IMPORTS =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getFirestore, 
  addDoc, 
  collection, 
  getDocs 
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


// ================= INIT =================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// ================= AUTH SYSTEM =================

// Signup
window.signup = async function () {
  const email = document.getElementById("loginEmail")?.value;
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    alert("Enter email & password");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup Successful ✅");
  } catch (err) {
    alert(err.message);
  }
};

// Login
window.login = async function () {
  const email = document.getElementById("loginEmail")?.value;
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    alert("Enter email & password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful ✅");
  } catch (err) {
    alert(err.message);
  }
};

// Logout
window.logout = async function () {
  try {
    await signOut(auth);
    alert("Logged Out ✅");
  } catch (err) {
    alert(err.message);
  }
};


// ================= PAGE LOAD =================
window.addEventListener("DOMContentLoaded", () => {

  // REGISTER FORM
  const form = document.getElementById("registerForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value;
      const email = document.getElementById("email")?.value;
      const phone = document.getElementById("phone")?.value;
      const category = document.getElementById("category")?.value;

      if (!name || !email || !phone) {
        alert("Fill all fields");
        return;
      }

      try {
        await addDoc(collection(db, "users"), {
          name,
          email,
          phone,
          category,
          createdAt: new Date()
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
});


// ================= SAVE VIDEO =================
window.saveVideo = async function () {
  const title = document.getElementById("videoTitle")?.value;
  const link = document.getElementById("youtubeLink")?.value;

  if (!title || !link) {
    alert("Fill all fields");
    return;
  }

  if (!link.includes("youtube") && !link.includes("youtu.be")) {
    alert("Enter valid YouTube link ❌");
    return;
  }

  try {
    await addDoc(collection(db, "videos"), {
      title,
      link,
      approved: false,
      time: new Date()
    });

    alert("Video Uploaded (Pending Approval) ⏳");

  } catch (err) {
    alert(err.message);
  }
};


// ================= LOAD VIDEOS =================
async function loadVideos() {
  const container = document.getElementById("videoList");

  if (!container) return;

  container.innerHTML = "<p>Loading videos...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "videos"));

    if (querySnapshot.empty) {
      container.innerHTML = "<p>No videos available</p>";
      return;
    }

    container.innerHTML = "";

    querySnapshot.forEach(doc => {
      const data = doc.data();

      // ✅ ONLY APPROVED VIDEOS
      if (data.approved !== true) return;

      let videoId = "";

      if (data.link.includes("v=")) {
        videoId = data.link.split("v=")[1].split("&")[0];
      } 
      else if (data.link.includes("youtu.be")) {
        videoId = data.link.split("youtu.be/")[1];
      }

      container.innerHTML += `
        <div class="video-card">
          <h3>${data.title}</h3>
          <iframe width="100%" height="200"
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0" allowfullscreen></iframe>
        </div>
      `;
    });

  } catch (err) {
    container.innerHTML = "<p>Error loading videos</p>";
    console.error(err);
  }
}


// ================= EXPORT =================
export { db };