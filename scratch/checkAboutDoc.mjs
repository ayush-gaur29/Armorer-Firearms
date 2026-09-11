import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoHnNZU2zdR63bwhbl07EBPbHtbATo8K0",
  authDomain: "highland-firearms.firebaseapp.com",
  projectId: "highland-firearms",
  storageBucket: "highland-firearms.firebasestorage.app",
  messagingSenderId: "960225337027",
  appId: "1:960225337027:web:0c3e9e44bb1294b1910c76",
};

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const snap = await getDoc(doc(db, "site_content", "about"));
  console.log("site_content/about exists?", snap.exists());
  if (snap.exists()) {
    console.log("Data:", JSON.stringify(snap.data(), null, 2));
  }
  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
