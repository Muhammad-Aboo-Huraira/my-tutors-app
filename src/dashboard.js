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
  serverTimestamp,
  Timestamp as FirestoreTimestamp,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

const auth = getAuth(firebaseapp);
const db = getFirestore(firebaseapp);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const currentUser = auth.currentUser;

      const userQuery = query(
        collection(db, "users"),
        where("user_id", "==", currentUser.uid)
      );
      const userQuerySnapshot = await getDocs(userQuery);

      if (userQuerySnapshot.size > 0) {
        const userDoc = userQuerySnapshot.docs[0];
        const userType = userDoc.data().role;
        const username = userDoc.data().username;

        if (userType === "admin") {
          document.getElementById("usernamePlaceholder").innerHTML = username;
        } else if (userType === "student") {
          document.getElementById("usernamePlaceholder").innerHTML = username;

          // let navbarContainer = document.getElementById("navbarContainer");
          // let navItem1 = navbarContainer.querySelector(".nav-item1");

          // // Create a new <a> element
          // let newLink = document.createElement("a");
          // newLink.classList.add("navbar-brand");
          // newLink.href = "request.html";
          // newLink.textContent = "Request teacher";

          // navItem1.parentNode.insertBefore(newLink, navItem1.nextSibling);
          let sidebarContainer = document.querySelector(".sidebar-cont ul");

          // Create a new <li> element
          let newNavItem = document.createElement("li");
          newNavItem.classList.add("nav-item");
          
          // Create a new <a> element
          let newLink = document.createElement("a");
          newLink.classList.add("nav-link");
          newLink.href = "request.html";
          newLink.textContent = "Request teacher";
          
          // Append the new <a> element to the new <li> element
          newNavItem.appendChild(newLink);
          
          // Append the new <li> element to the sidebar container
          sidebarContainer.appendChild(newNavItem);
          // Get modal instance
          // let modal = new bootstrap.Modal(
          //   document.getElementById("exampleModal")
          // );
          // const modalTitle = document.getElementById("exampleModalLabel");
          // modalTitle.innerText = "Request teacher";

          // // Add click event listener to the new <a> element
          // newLink.addEventListener("click", function () {
          //   // Open the modal when the new link is clicked
          //   modal.show();
          // });
          // ...

          // Add an event listener to the "Generate" button
          const requestForm = document.querySelector(".reqForm");
          
          requestForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const subject = document.getElementById("recipient-name").value;
            const description = document.getElementById("description").value;
            const amount = document.getElementById("amount").value;
            const timeFrom = document.getElementById("timeFrom").value;
            const timeTo = document.getElementById("timeTo").value;

            // Convert time strings to formatted time strings
            const formattedTimeFrom = new Date(
              `1970-01-01T${timeFrom}`
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const formattedTimeTo = new Date(
              `1970-01-01T${timeTo}`
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            console.log(timeFrom, timeTo);

            // Add the data to the "requests" collection in Firestore
            addDoc(collection(db, "requests"), {
              subject: subject,
              description: description,
              amount: amount,
              timeFrom: formattedTimeFrom,
              timeTo: formattedTimeTo,
              created: serverTimestamp(),
            }).catch((error) => {
                console.error("Error adding document: ", error);
              });
          });

          // ...
        } else if (userType === "teacher") {
          document.getElementById("usernamePlaceholder").innerHTML = username;
        }
      } else {
        console.error("User document does not exist");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    window.location.href = "index.html";
  }
});

// const toast = new bootstrap.Toast(document.querySelector(".toast"));
// toast.show();
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
