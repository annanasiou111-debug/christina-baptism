const db = firebase.firestore();
const storage = firebase.storage();

/* ================== ΦΩΤΟ & ΒΙΝΤΕΟ ================== */

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
    const ref = storage.ref(
      "uploads/" + Date.now() + "_" + file.name
    );

    ref.put(file).catch(err => {
      alert("Σφάλμα: " + err.message);
    });
  });

  input.value = "";
}

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
        el.style.borderRadius = "12px";
        el.style.marginBottom = "10px";
        el.style.cursor = "pointer";

        el.onclick = () => {
          window.open(url, "_blank");
        };

        gallery.appendChild(el);
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
        const d = doc.data();
        const div = document.createElement("div");
        div.className = "wish";
        div.innerHTML = `<strong>${d.name}</strong><br>${d.wish}`;
        wishesDiv.appendChild(div);
      });
    });
}

/* ================== LOAD ================== */

window.addEventListener("load", () => {
  loadPhotos();
  loadWishes();
});
