import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFMvIFGiU3GzJCIuUF4E37GwtZ6Hv3RDA",
  authDomain: "roxten-studios.firebaseapp.com",
  projectId: "roxten-studios",
  storageBucket: "roxten-studios.firebasestorage.app",
  messagingSenderId: "390135535276",
  appId: "1:390135535276:web:dda05b5eacecabd6053109",
  measurementId: "G-54XL73W5N7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testQuery() {
  console.log("Testing getDocs with orderBy('order', 'desc')...");
  try {
    const q = query(collection(db, "works"), orderBy("order", "desc"));
    const snap = await getDocs(q);
    console.log(`Found ${snap.size} documents.`);
    snap.docs.forEach(doc => {
      console.log(doc.id, doc.data());
    });
  } catch (err) {
    console.error("Error fetching documents:", err);
  }
  process.exit(0);
}

testQuery();
