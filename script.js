const db = firebase.firestore();
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
const db = firebase.firestore();

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
  .catch(error => {
    alert("Σφάλμα αποθήκευσης 😢");
    console.error(error);
  });
}
function loadWishes() {
  const wishesDiv = document.getElementById("wishes");
  wishesDiv.innerHTML = "";

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

window.onload = loadWishes;
