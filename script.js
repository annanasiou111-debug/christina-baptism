// ===============================
// FIREBASE INIT REFERENCES
// ===============================
const db = firebase.firestore();
const storage = firebase.storage();

// ===============================
// ΕΥΧΕΣ
// ===============================
function addWish() {
  const name = document.getElementById("name").value.trim();
  const wish = document.getElementById("wish").value.trim();

  if (!name || !wish) {
    alert("Συμπλήρωσε όνομα και ευχή 💗");
    return;
  }

  db.collection("wishes").add({
    name: name,
    wish: wish,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    document.getElementById("name").value = "";
    document.getElementById("wish").value = "";
  })
  .catch(err => {
    alert("Σφάλμα αποθήκευσης ευχής");
    console.error(err);
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

// ===============================
// UPLOAD ΦΩΤΟ & ΒΙΝΤΕΟ
// ===============================
async function uploadPhoto() {
  const input = document.getElementById("photoInput");
  const files = input.files;

  if (!files || files.length === 0) {
    alert("Δεν επέλεξες αρχεία 🙂");
    return;
  }

  if (files.length > 10) {
    alert("Μέχρι 10 αρχεία επιτρέπονται 📸🎥");
    return;
  }

  alert("Ξεκινάει το ανέβασμα… ⏳");

  for (let file of files) {
    if (
      !file.type.startsWith("image/") &&
      !file.type.startsWith("video/")
    ) {
      continue;
    }

    const fileName = Date.now() + "_" + file.name;
    const fileRef = storage.ref("uploads/" + fileName);

    try {
      const snapshot = await fileRef.put(file);
      const url = await snapshot.ref.getDownloadURL();
      addToGallery(url, file.type);
    } catch (err) {
      alert("Σφάλμα στο upload ❌");
      console.error(err);
    }
  }

  input.value = "";
  alert("Ολοκληρώθηκε το ανέβασμα ❤️");
}

// ===============================
// GALLERY
// ===============================
function addToGallery(url, type) {
  const gallery = document.getElementById("gallery");

  if (type.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = url;
    gallery.prepend(img);
  }

  if (type.startsWith("video/")) {
    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    gallery.prepend(video);
  }
}

function loadPhotos() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  storage.ref("uploads").listAll().then(res => {
    res.items.forEach(item => {
      item.getDownloadURL().then(url => {
        if (item.name.match(/\.(mp4|mov|webm)$/i)) {
          const video = document.createElement("video");
          video.src = url;
          video.controls = true;
          gallery.appendChild(video);
        } else {
          const img = document.createElement("img");
          img.src = url;
          gallery.appendChild(img);
        }
      });
    });
  });
}

// ===============================
// LOAD EVERYTHING
// ===============================
window.addEventListener("load", () => {
  loadWishes();
  loadPhotos();
});
