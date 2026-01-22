// Firebase references
const db = firebase.firestore();
const storage = firebase.storage();

// =======================
// UPLOAD ΦΩΤΟ / ΒΙΝΤΕΟ
// =======================
async function uploadPhoto() {
  const input = document.getElementById("photoInput");
  const files = input.files;

  if (!files || files.length === 0) {
    alert("Δεν επέλεξες αρχεία 🙂");
    return;
  }

  if (files.length > 10) {
    alert("Μπορείς να ανεβάσεις έως 10 αρχεία.");
    return;
  }

  for (let file of files) {
    const fileType = file.type;

    if (!fileType.startsWith("image/") && !fileType.startsWith("video/")) {
      continue;
    }

    const fileName = Date.now() + "_" + file.name;
    const storageRef = storage.ref("uploads/" + fileName);

    try {
      const snapshot = await storageRef.put(file);
      const url = await snapshot.ref.getDownloadURL();
      addToGallery(url, fileType);
    } catch (err) {
      console.error("Σφάλμα upload:", err);
      alert("Κάτι πήγε στραβά με το upload");
    }
  }

  input.value = ""; // καθαρίζει το input
}

// =======================
// GALLERY
// =======================
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
