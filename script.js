const db = firebase.firestore();
const storage = firebase.storage();

/* ========== UPLOAD ΦΩΤΟ / ΒΙΝΤΕΟ ========== */
function uploadPhoto() {
  const input = document.getElementById("photoInput");
  const files = input.files;

  if (!files.length) {
    alert("Διάλεξε αρχεία 🙂");
    return;
  }

  if (files.length > 10) {
    alert("Έως 10 αρχεία επιτρέπονται 📸🎥");
    return;
  }

  Array.from(files).forEach(file => {
    const ref = storage.ref("uploads/" + Date.now() + "_" + file.name);

    ref.put(file)
      .then(() => console.log("Ανέβηκε:", file.name))
      .catch(err => alert(err.message));
  });

  input.value = "";
}

/* ========== LOAD ΦΩΤΟ / ΒΙΝΤΕΟ ========== */
function loadPhotos() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  storage.ref("uploads").listAll().then(res => {
    res.items.forEach(item => {
      item.getDownloadURL().then(url => {
        let el;

        if (item.name.match(/\.(mp4|webm|mov)$/i)) {
          el = document.createElement("video");
          el.controls = true;
        } else {
          el = document.createElement("img");
        }

        el.src = url;
        el.style.width = "100%";
        el.style.marginBottom = "10px";
        gallery.appendChild(el);
      });
    });
  });
}

/* ========== ΕΥΧΕΣ ========== */
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
  });

  document.getElementById("name").value = "";
  document.getElementById("wish").value = "";
}

function loadWishes() {
  const div = document.getElementById("wishes");

  db.collection("wishes")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      div.innerHTML = "";
      snapshot.forEach(doc => {
        const d = doc.data();
        div.innerHTML += `<div class="wish"><strong>${d.name}</strong><br>${d.wish}</div>`;
      });
    });
}

/* ========== LOAD ========== */
window.addEventListener("load", () => {
  loadPhotos();
  loadWishes();
});
