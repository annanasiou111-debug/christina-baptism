const db = firebase.firestore();

/* ================== ΦΩΤΟ ================== */
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
    const fileRef = storage.ref("uploads/" + Date.now() + "_" + file.name);

    fileRef.put(file)
      .then(() => {
        console.log("Ανέβηκε:", file.name);
      })
      .catch(err => {
        alert("Σφάλμα: " + err.message);
      });
  });

  input.value = "";
}

function loadPhotos() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const listRef = storage.ref("uploads");

  listRef.listAll().then(res => {
    res.items.forEach(itemRef => {
      itemRef.getDownloadURL().then(url => {

        if (itemRef.name.match(/\.(mp4|webm|mov)$/i)) {
          const video = document.createElement("video");
          video.src = url;
          video.controls = true;
          video.style.width = "100%";
          video.style.marginBottom = "10px";
          gallery.appendChild(video);
        } else {
          const img = document.createElement("img");
          img.src = url;
          img.style.width = "100%";
          img.style.marginBottom = "10px";
          gallery.appendChild(img);
        }

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

window.addEventListener("load", () => {
  loadPhotos();
  loadWishes();
});
