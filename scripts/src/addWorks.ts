import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

const urls = [
  "https://twilloxclothing.vercel.app/",
  "https://srija-alpha.vercel.app/",
  "https://iCarss.netlify.app",
  "https://monarch-living.netlify.app",
  "https://kitchora.netlify.app",
  "https://velourashopping.netlify.app/",
  "https://auraeventss.netlify.app/",
  "https://inkoranovels.netlify.app/",
  "https://bazaarbolt.in"
];

async function addWorks() {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    
    // Extract a nice name from the URL
    let name = url.replace("https://", "").replace("http://", "").split(".")[0];
    name = name.charAt(0).toUpperCase() + name.slice(1).replace("-", " ");
    
    const workData = {
      title: name,
      category: "Web Development",
      description: `A modern website built for ${name}.`,
      link: url.startsWith("http") ? url : `https://${url}`,
      order: i + 1,
      createdAt: Date.now()
    };
    
    try {
      await addDoc(collection(db, "works"), workData);
      console.log(`Successfully added: ${name}`);
    } catch (err) {
      console.error(`Failed to add ${name}:`, err);
    }
  }
  
  console.log("All works added! You can press Ctrl+C to exit if it hangs.");
  process.exit(0);
}

addWorks();
