import { firebaseapp } from "./firebaseConfig.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  getFirestore,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
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
          document.getElementById("usernamePlaceholder").innerHTML = `Student: ${username}`;

          if (
            window.location.href.includes("dashboard.html") ||
            window.location.href.includes("request.html")
          ) {
            if (window.location.href.includes("dashboard.html")) {
              document.querySelector(".proposalCards").remove();
            }
            if (window.location.href.includes("request.html")) {
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

              // Add the data to the "requests" collection in Firestore
              addDoc(collection(db, "requests"), {
                subject: subject,
                user_id: currentUser.uid,
                description: description,
                amount: amount,
                timeFrom: formattedTimeFrom,
                timeTo: formattedTimeTo,
                created: serverTimestamp(),
              }).catch((error) => {
                console.error("Error adding document: ", error);
              });
              requestForm.reset();
            });
          }
            
            if (window.location.href.includes("dashboard.html")) {
              const cardContainer = document.getElementById("cardContainer");
              
              // Function to create a card with data
              function createCard(data) {
                const cardDiv = document.createElement("div");
                cardDiv.className = "col-md-4 mb-4";

                const card = document.createElement("div");
                card.className = "card custom-card";

                const cardBody = document.createElement("div");
                cardBody.className = "card-body";

                const title = document.createElement("h5");
                title.className = "card-title";
                title.textContent = data.subject;

                const description = document.createElement("p");
                description.className = "card-text";
                description.textContent = `Description: ${data.description}`;

                const time = document.createElement("p");
                time.className = "card-text";
                time.textContent = `Time slot: ${data.timeFrom} - ${data.timeTo}`;

                const amount = document.createElement("p");
                amount.className = "card-text";
                amount.textContent = `PKR ${data.amount}`;

                cardBody.appendChild(title);
                cardBody.appendChild(description);
                cardBody.appendChild(time);
                cardBody.appendChild(amount);

                card.appendChild(cardBody);
                cardDiv.appendChild(card);

                cardContainer.appendChild(cardDiv);
              }
              async function fetchDataFromFirestore() {
                const requestsCollection = collection(db, "requests");

                const q = query(
                  requestsCollection,
                  where("user_id", "==", currentUser.uid),
                  orderBy("created", "desc"),
                  limit(3)
                );

                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  createCard(data);
                });
              }
              fetchDataFromFirestore();
            }

            // Call the function to fetch data and populate cards
          } else if (window.location.href.includes("allrequests.html")) {
            const cardContainer = document.getElementById("cardContainer");
            const withdrawModal = new bootstrap.Modal(
              document.getElementById("withdrawModal")
            );
            const withdrawModalBody =
              document.getElementById("withdrawModalBody");
            const confirmWithdrawButton =
              document.getElementById("confirmWithdraw");
            // Function to create a card with data
            function createCard(data, docId) {
              const cardDiv = document.createElement("div");
              cardDiv.id = `card-${docId}`;
              cardDiv.className = "col-md-4 mb-4";

              const card = document.createElement("div");
              card.className = "card custom-card";

              const cardBody = document.createElement("div");
              cardBody.className = "card-body";

              const title = document.createElement("h5");
              title.className = "card-title";
              title.textContent = data.subject;

              const description = document.createElement("p");
              description.className = "card-text";
              description.textContent = `Description: ${data.description}`;

              const time = document.createElement("p");
              time.className = "card-text";
              time.textContent = `Time slot: ${data.timeFrom} - ${data.timeTo}`;

              const amount = document.createElement("p");
              amount.className = "card-text";
              amount.textContent = `PKR ${data.amount}`;

              const withdraw = document.createElement("a");
              withdraw.href = "#";
              withdraw.className = "btn btn-danger";
              withdraw.textContent = "Withdraw";
              withdraw.style.color = "white";
              withdraw.addEventListener("click", () => {
                // Update modal content
                withdrawModalBody.innerHTML =
                  "<p>Are you sure you want to withdraw the request?</p>";
                // Show the modal
                withdrawModal.show();
                // Set up event listener for Confirm Withdraw button in the modal
                confirmWithdrawButton.addEventListener("click", async () => {
                  // Perform the withdrawal action here
                  await deleteDocument(docId);
                  withdrawModal.hide();
                });
              });
              cardBody.appendChild(title);
              cardBody.appendChild(description);
              cardBody.appendChild(time);
              cardBody.appendChild(amount);
              cardBody.appendChild(withdraw);

              card.appendChild(cardBody);
              cardDiv.appendChild(card);

              cardContainer.appendChild(cardDiv);
            }

            async function fetchDataFromFirestore() {
              const requestsCollection = collection(db, "requests");

              const q = query(
                requestsCollection,
                where("user_id", "==", currentUser.uid),
                orderBy("created", "desc")
              );

              const querySnapshot = await getDocs(q);

              querySnapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id;
                createCard(data, docId);
              });
            }
            fetchDataFromFirestore();
            async function deleteDocument(docId) {
              const requestsCollection = collection(db, "requests");

              try {
                await deleteDoc(doc(requestsCollection, docId));
                console.log("Document successfully deleted!");

                const cardDiv = document.getElementById(`card-${docId}`);
                if (cardDiv) {
                  cardDiv.remove();
                }
              } catch (error) {
                console.error("Error deleting document: ", error);
              }
            }
          }
        } else if (userType === "teacher") {
          document.getElementById("usernamePlaceholder").innerHTML = `Teacher: ${username}`;
          document.getElementById("requestTeacherLink").remove();

          if (window.location.href.includes("dashboard.html")) {
            const cardContainer = document.getElementById("cardContainer");

            // Function to create a card with data
            function createCard(data) {
              const cardDiv = document.createElement("div");
              cardDiv.className = "col-md-4 mb-4";

              const card = document.createElement("div");
              card.className = "card custom-card";

              const cardBody = document.createElement("div");
              cardBody.className = "card-body";

              const title = document.createElement("h5");
              title.className = "card-title";
              title.textContent = data.subject;

              const description = document.createElement("p");
              description.className = "card-text";
              description.textContent = `Description: ${data.description}`;

              const time = document.createElement("p");
              time.className = "card-text";
              time.textContent = `Time slot: ${data.timeFrom} - ${data.timeTo}`;

              const amount = document.createElement("p");
              amount.className = "card-text";
              amount.textContent = `PKR ${data.amount}`;

              cardBody.appendChild(title);
              cardBody.appendChild(description);
              cardBody.appendChild(time);
              cardBody.appendChild(amount);

              card.appendChild(cardBody);
              cardDiv.appendChild(card);

              cardContainer.appendChild(cardDiv);
            }

            async function fetchDataFromFirestore() {
              const requestsCollection = collection(db, "requests");

              const q = query(
                requestsCollection,
                orderBy("created", "desc"),
                limit(3)
              );

              const querySnapshot = await getDocs(q);

              querySnapshot.forEach((doc) => {
                const data = doc.data();
                createCard(data);
              });
            }

            fetchDataFromFirestore();
          } else if (window.location.href.includes("allrequests.html")) {
            const cardContainer = document.getElementById("cardContainer");
            document.querySelector(".add-more").remove();
            // Function to create a card with data
            function createCard(data) {
              const cardDiv = document.createElement("div");
              cardDiv.className = "col-md-4 mb-4";

              const card = document.createElement("div");
              card.className = "card custom-card";

              const cardBody = document.createElement("div");
              cardBody.className = "card-body";

              const title = document.createElement("h5");
              title.className = "card-title";
              title.textContent = data.subject;

              const description = document.createElement("p");
              description.className = "card-text";
              description.textContent = `Description: ${data.description}`;

              const time = document.createElement("p");
              time.className = "card-text";
              time.textContent = `Time slot: ${data.timeFrom} - ${data.timeTo}`;

              const amount = document.createElement("p");
              amount.className = "card-text";
              amount.textContent = `PKR ${data.amount}`;

              const sendProposal = document.createElement("a");
              sendProposal.href = "#";
              sendProposal.className = "btn btn-primary";
              sendProposal.textContent = "Send proposal";
              sendProposal.style.color = "white";

              cardBody.appendChild(title);
              cardBody.appendChild(description);
              cardBody.appendChild(time);
              cardBody.appendChild(amount);
              cardBody.appendChild(sendProposal);

              card.appendChild(cardBody);
              cardDiv.appendChild(card);

              cardContainer.appendChild(cardDiv);
            }

            async function fetchDataFromFirestore() {
              const requestsCollection = collection(db, "requests");

              const q = query(requestsCollection, orderBy("created", "desc"));

              const querySnapshot = await getDocs(q);

              querySnapshot.forEach((doc) => {
                const data = doc.data();
                createCard(data);
              });
            }

            // Call the function to fetch data and populate cards
            fetchDataFromFirestore();
          }
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
