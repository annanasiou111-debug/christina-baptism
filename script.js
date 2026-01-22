// Firebase refs
const db = firebase.firestore();
const storage = firebase.storage();

/* ================== ΕΥΧΕΣ ================== */

function addWish() {
  const name = document.getElementById("name").value.trim();
  const wish = document.getElementById("wish").value.trim();

  if (!name || !wish) {
    alert("Συμπλήρωσε όνομα και ευχή 💕");
    return;
  }

  db.collection("wishes").add({
    name,
    wish,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("name").value = "";
    document.getElementById("wish").value = "";
    loadWishes();
  }).catch(err => alert(err.message));
}

function loadWishes() {
  const wishesDiv = document.getElementById("wishes");
  wishesDiv.innerHTML = "";

  db.collection("wishes")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      wishesDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const d = doc.data();
        const div = document.createElement("div");
        div.className = "wish";
        div.innerHTML = `<strong>${d.name}</strong><br>${d.wish}`;
        wishesDiv.appendChild(div);
      });
    });
}

/* ================== UPLOAD ================== */

function uploadPhoto() {
  const input = document.getElementById("photoInput");
  const files = input.files;

  if (!files.length) {
    alert("Διάλεξε αρχεία 🙂");
    return;
  }

  if (files.length > 10) {
    alert("Έως 10 αρχεία επιτρέπονται");
    return;
  }

  Array.from(files).forEach(file => {
    const ref = storage.ref("uploads/" + Date.now() + "_" + file.name);

    ref.put(file)
      .then(() => loadPhotos())
      .catch(err => alert(err.message));
  });

  input.value = "";
}

/* ================== GALLERY ================== */

function loadPhotos() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  storage.ref("uploads").listAll().then(res => {
    res.items.forEach(item => {
      item.getDownloadURL().then(url => {
        let el;

        if (url.includes(".mp4") || url.includes(".webm")) {
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

/* ================== LOAD ================== */

window.addEventListener("load", () => {
  loadWishes();
  loadPhotos();
});
