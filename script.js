// 🔥 Firebase init references
const db = firebase.firestore();
const storage = firebase.storage();

alert("JS φορτώθηκε σωστά");

/* =======================
   ΕΥΧΕΣ
======================= */
function addWish() {
  const name = document.getElementById("name").value.trim();
  const wish = document.getElementById("wish").value.trim();

  if (!name || !wish) {
    alert("Συμπλήρωσε όνομα και ευχή 💕");
    return;
  }

  db.collection("wishes").add({
    name: name,
    wish: wish,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("name").value = "";
    document.getElementById("wish").value = "";
  }).catch(err => {
    alert("Σφάλμα ευχής");
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

/* =======================
   UPLOAD ΦΩΤΟ / ΒΙΝΤΕΟ
======================= */
async function uploadPhoto() {
  const input = document.getElementById("photoInput");
  const files = input.files;

  if (!files || files.length === 0) {
    alert("Διάλεξε αρχεία 🙂");
    return;
  }

  if (files.length > 10) {
    alert("Έως 10 αρχεία επιτρέπονται");
    return;
  }

  for (let file of files) {
    const fileName = Date.now() + "_" + file.name;
    const ref = storage.ref("uploads/" + fileName);

    try {
      const snap = await ref.put(file);
      const url = await snap.ref.getDownloadURL();
      addToGallery(url, file.type);
    } catch (e) {
      alert("Σφάλμα στο ανέβασμα");
      console.error(e);
    }
  }

  input.value = "";
}

/* =======================
   GALLERY
======================= */
function addToGallery(url, type) {
  const gallery = document.getElementById("gallery");

  if (type.startsWith("image")) {
    const img = document.createElement("img");
    img.src = url;
    gallery.prepend(img);
  }

  if (type.startsWith("video")) {
    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    gallery.prepend(video);
  }
}

function loadGallery() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  storage.ref("uploads").listAll().then(res => {
    res.items.forEach(item => {
      item.getDownloadURL().then(url => {
        const isVideo = item.name.match(/\.(mp4|mov|webm)$/i);
        addToGallery(url, isVideo ? "video" : "image");
      });
    });
  });
}

/* =======================
   INIT
======================= */
window.onload = () => {
  loadWishes();
  loadGallery();
};
