// ===============================
// FIREBASE REFERENCES
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
// UPLOAD ΦΩΤΟ & ΒΙΝΤΕΟ (έως 10)
// ===============================
async function uploadPhoto() {
  const input = document.getElementById("photoInput");
  const files = Array.from(input.files);

  if (files.length === 0) {
    alert("Δεν επέλεξες αρχεία 🙂");
    return;
  }

  if (files.length > 10) {
    alert("Μπορείς να ανεβάσεις έως 10 αρχεία 📸🎥");
    return;
  }

  alert("Ξεκινάει το ανέβασμα...");

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (
        !file.type.startsWith("image/") &&
        !file.type.startsWith("video/")
      ) {
        continue;
      }

      // timestamp για ΣΤΑΘΕΡΗ ΣΕΙΡΑ
      const fileName = `${Date.now()}_${i}_${file.name}`;
      const ref = storage.ref("uploads/" + fileName);

      await ref.put(file);
    }

    input.value = "";
    alert("Το ανέβασμα ολοκληρώθηκε ❤️");

    // ξαναφορτώνει τη gallery
    loadPhotos();

  } catch (err) {
    console.error(err);
    alert("Κάτι πήγε στραβά στο ανέβασμα 😢");
  }
}

// ===============================
// GALLERY (ΣΤΑΘΕΡΗ ΣΕΙΡΑ)
// ===============================
async function loadPhotos() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  try {
    const listRef = storage.ref("uploads");
    const res = await listRef.listAll();

    // Σειρά βάσει ονόματος (timestamp)
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

  } catch (err) {
    console.error("Σφάλμα φόρτωσης gallery:", err);
  }
}

// ===============================
// LOAD ΣΕΛΙΔΑΣ
// ===============================
window.addEventListener("load", () => {
  loadWishes();
  loadPhotos();
});
