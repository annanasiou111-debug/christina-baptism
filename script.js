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
  const files = Array.from(input.files);

  if (!files.length) {
    alert("Δεν επέλεξες αρχεία 🙂");
    return;
  }

  if (files.length > 10) {
    alert("Έως 10 αρχεία επιτρέπονται 📸🎥");
    return;
  }

  alert("Ξεκινάει το ανέβασμα...");

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = `${Date.now()}_${i}_${file.name}`;
    const ref = firebase.storage().ref("uploads/" + fileName);
    await ref.put(file);
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

async function loadPhotos() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const listRef = firebase.storage().ref("uploads");
  const res = await listRef.listAll();

  // Ταξινόμηση με βάση το όνομα (χρονική σειρά)
  const sortedItems = res.items.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  for (const itemRef of sortedItems) {
    const url = await itemRef.getDownloadURL();

    if (itemRef.name.match(/\.(mp4|mov|webm)$/i)) {
      const video = document.createElement("video");
      video.src = url;
      video.controls = true;
      gallery.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = url;
      gallery.appendChild(img);
    }
  }
}
// ===============================
// LOAD EVERYTHING
// ===============================
window.addEventListener("load", () => {
  loadWishes();
  loadPhotos();
});
