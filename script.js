// 🔥 Firebase configuration (ΘΑ ΣΥΜΠΛΗΡΩΘΕΙ ΣΤΟ ΕΠΟΜΕΝΟ ΒΗΜΑ)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJRdK_Erx0oWN2kJLVfbwrN-xHJ8saTcQ",
  authDomain: "christina-baptism-752bb.firebaseapp.com",
  projectId: "christina-baptism-752bb",
  storageBucket: "christina-baptism-752bb.firebasestorage.app",
  messagingSenderId: "1002255831082",
  appId: "1:1002255831082:web:f0a52618f9f65337cd3353"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();

// ➕ Προσθήκη ευχής
function addWish() {
  const name = document.getElementById("name").value;
  const wish = document.getElementById("wish").value;

  if (!name || !wish) {
    alert("Συμπλήρωσε όνομα και ευχή 💕");
    return;
  }

  db.collection("wishes").add({
    name: name,
    wish: wish,
    date: new Date()
  });

  document.getElementById("name").value = "";
  document.getElementById("wish").value = "";
}

// 📥 Φόρτωση ευχών live
db.collection("wishes")
  .orderBy("date", "desc")
  .onSnapshot(snapshot => {
    const wishesDiv = document.getElementById("wishes");
    wishesDiv.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      wishesDiv.innerHTML += `
        <div>
          <strong>${data.name}</strong><br>
          ${data.wish}
        </div>
      `;
    });
  });

// 📸 Upload φωτογραφιών
function uploadPhoto() {
  const file = document.getElementById("photoInput").files[0];
  if (!file) {
    alert("Διάλεξε πρώτα αρχείο 📸");
    return;
  }

  const ref = storage.ref("photos/" + Date.now() + "_" + file.name);
  ref.put(file).then(() => {
    alert("Η φωτογραφία ανέβηκε 💗");
    document.getElementById("photoInput").value = "";
  });
}
