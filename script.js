const storage = firebase.storage();

function uploadPhoto() {
  const input = document.getElementById("photoInput");
  const file = input.files[0];

  if (!file) {
    alert("Διάλεξε πρώτα μια φωτογραφία ή βίντεο 🙂");
    return;
  }

  const storageRef = storage.ref("uploads/" + file.name);

  storageRef.put(file)
    .then(() => {
      alert("Το αρχείο ανέβηκε επιτυχώς ❤️");
      input.value = "";
    })
    .catch((error) => {
      alert("Σφάλμα: " + error.message);
    });
}
function loadPhotos() {
  const gallery = document.getElementById("gallery");
  const listRef = storage.ref("uploads");

  listRef.listAll().then(res => {
    res.items.forEach(itemRef => {
      itemRef.getDownloadURL().then(url => {
        const img = document.createElement("img");
        img.src = url;
        img.style.width = "100%";
        img.style.marginBottom = "10px";
        gallery.appendChild(img);
      });
    });
  });
}

window.onload = loadPhotos;
