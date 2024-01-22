import { firebaseapp } from "./firebaseConfig.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  getFirestore,
  addDoc,
  getDocs,
  query,
  where,
  collection,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

const auth = getAuth(firebaseapp);
const db = getFirestore(firebaseapp);

onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const currentUser = auth.currentUser;
        
        const userQuery = query(collection(db, 'users'), where("user_id", "==", currentUser.uid));
        const userQuerySnapshot = await getDocs(userQuery);
        
        if (userQuerySnapshot.size > 0) {
          // Assuming that "uid" is a field in your documents that stores the user's UID
          const userDoc = userQuerySnapshot.docs[0];
          const userType = userDoc.data().role;
          const username = userDoc.data().username;
          console.log(username);
 
        //   executeDashboardFunctions(userType);
          if (userType === 'admin') {
            let greet = document.querySelector("h4")
            greet.innerHTML = "Haan admin bhai?"
            document.getElementById('usernamePlaceholder').innerHTML = username;
          } else if (userType === 'student') {
            let greet = document.querySelector("h4")
            greet.innerHTML = "Haan student?"
            document.getElementById('usernamePlaceholder').innerHTML = username;
          } else if (userType === 'teacher') {
            let greet = document.querySelector("h4")
            greet.innerHTML = "Haan teacher?"
            document.getElementById('usernamePlaceholder').innerHTML = username;
          }
        } else {
          console.error("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  });
  
  
  
  function executeDashboardFunctions(userType) {
    // Execute functions based on user type
    
  }
  
  function adminDashboardFunctions() {
  }
  
  function studentDashboardFunctions() {
  }
  
  function teacherDashboardFunctions() {
  }

const toast = new bootstrap.Toast(document.querySelector(".toast"));
toast.show();
document
  .querySelector(".sign-out-option")
  .addEventListener("click", function (event) {
    event.preventDefault();
    signOut(auth)
      .then(() => {
        window.location.href = "index.html";
        window.history.replaceState(null, "", "index.html");
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
