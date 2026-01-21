const db = firebase.firestore();
const storage = firebase.storage();

/* ================== ΦΩΤΟ ================== */
function uploadPhoto() {
  const input = document.getElementById("photoInput");
  const file = input.files[0];

  if (!file) {
    alert("Διάλεξε πρώτα μια φωτογραφία ή βίντεο 🙂");
    return;
  }

  const storageRef = storage.ref("uploads/" + Date.now() + "_" + file.name);

  storageRef.put(file)
    .then(() => {
      alert("Το αρχείο ανέβηκε επιτυχώς ❤️");
      input.value = "";
      loadPhotos();
    })
    .catch(error => {
      alert("Σφάλμα: " + error.message);
    });
}

function loadPhotos() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  storage.ref("uploads").listAll().then(res => {
    res.items.forEach(item => {
      item.getDownloadURL().then(url => {
        const img = document.createElement("img");
        img.src = url;
        img.style.width = "100%";
        img.style.marginBottom = "10px";
        gallery.appendChild(img);
      });
    });
  });
}

/* ================== ΕΥΧΕΣ ================== */
function addWish() {
  const name = document.getElementById("name").value.trim();
  const wish = document.getElementById("wish").value.trim();

  if (!name || !wish) {
    alert("Συμπλήρωσε όνομα και ευχή 💗");
    return;
  }

  db.collection("wishes").add({
    name,
    wish,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("name").value = "";
    document.getElementById("wish").value = "";
  });
}

function loadWishes() {
  const wishesDiv = document.getElementById("wishes");

  db.collection("wishes")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      wishesDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "wish";
        div.innerHTML = `<strong>${data.name}</strong><br>${data.wish}`;
        wishesDiv.appendChild(div);
      });
    });
}

/* ================== LOAD ================== */
window.onload = () => {
  loadPhotos();
  loadWishes();
};
