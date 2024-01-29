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
  updateDoc,
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
        const loader = document.createElement("div");
        loader.className = "spinner-border text-light visually-hidden";
        const loaderText = document.createElement("span");
        loaderText.className = "visually-hidden";
        loader.appendChild(loaderText);

        if (userType === "admin") {
          document.getElementById("usernamePlaceholder").innerHTML = username;
        } else if (userType === "student") {
          document.getElementById(
            "usernamePlaceholder"
          ).innerHTML = `Student: ${username}`;

          if (
            window.location.href.includes("dashboard.html") ||
            window.location.href.includes("request.html")
          ) {
            
            if (window.location.href.includes("request.html")) {
              const requestForm = document.querySelector(".reqForm");
              const submitButton = requestForm.querySelector(
                'button[type="submit"]'
              );

              requestForm.addEventListener("submit", (e) => {
                e.preventDefault();

                loader.classList.remove("visually-hidden");
                submitButton.innerHTML = "";
                submitButton.appendChild(loader);
                submitButton.disabled = false;

                const subject = document.getElementById("recipient-name").value;
                const description =
                  document.getElementById("description").value;
                const amount = document.getElementById("amount").value;
                const timeFrom = document.getElementById("timeFrom").value;
                const timeTo = document.getElementById("timeTo").value;

                // Convert time strings to formatted time strings
                const formattedTimeFrom = new Date(
                  `1970-01-01T${timeFrom}`
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const formattedTimeTo = new Date(
                  `1970-01-01T${timeTo}`
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

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
                setTimeout(() => {
                  submitButton.disabled = false;
                  submitButton.innerHTML = "Submit Request";
                  window.location.href = "allrequests.html";
                }, 2000);
              });
            }

            if (window.location.href.includes("dashboard.html")) {
              const cardContainer = document.getElementById("cardContainer");
              const cardContainer1 = document.getElementById("cardContainer1");

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

              function createProposalCard(data1) {
                const cardDiv1 = document.createElement("div");
                cardDiv1.className = "col-md-4 mb-4";
  
                const card1 = document.createElement("div");
                card1.className = "card custom-card";
  
                const cardBody1 = document.createElement("div");
                cardBody1.className = "card-body";
  
                const title1 = document.createElement("h5");
                title1.className = "card-title";
                title1.textContent = data1.subject;
  
                const qualification = document.createElement("p");
                qualification.className = "card-text";
                qualification.textContent = `Qualification: ${data1.qualification}`;
  
                const experience = document.createElement("p");
                experience.className = "card-text";
                experience.textContent = `Experience: ${data1.experience}`;
  
                const amount1 = document.createElement("p");
                amount1.className = "card-text";
                amount1.textContent = `PKR ${data1.amount}`;
  
                cardBody1.appendChild(title1);
                cardBody1.appendChild(qualification);
                cardBody1.appendChild(experience);
                cardBody1.appendChild(amount1);
  
                card1.appendChild(cardBody1);
                cardDiv1.appendChild(card1);
  
                cardContainer1.appendChild(cardDiv1);
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
                const proposalsCollection = collection(db, "proposals");
              const q1 = query(
                proposalsCollection,
                orderBy("created_at", "desc"),
                limit(3)
              );
              const querySnapshot1 = await getDocs(q1);
              querySnapshot1.forEach((doc) => {
                const data1 = doc.data();
                createProposalCard(data1);
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
          } else if (window.location.href.includes("allproposals.html")) {
            const cardContainer = document.getElementById("cardContainer");
            const withdrawModal = new bootstrap.Modal(
              document.getElementById("withdrawModal")
            );
            const withdrawModalBody =
              document.getElementById("withdrawModalBody");
            const confirmWithdrawButton =
              document.getElementById("confirmWithdraw");
              const modalTitle = document.querySelector(".modal-title");
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

              const qualification = document.createElement("p");
              qualification.className = "card-text";
              qualification.textContent = `Qualification: ${data.qualification}`;

              const experience = document.createElement("p");
              experience.className = "card-text";
              experience.textContent = `Experience: ${data.experience}`;

              const status = document.createElement("p");
              status.className = "card-text";
              status.textContent = `Status: ${data.status}`;

              const amount = document.createElement("p");
              amount.className = "card-text";
              amount.textContent = `PKR ${data.amount}`;

              const accept = document.createElement("a");
              accept.href = "#";
              accept.className = "btn btn-primary me-2";
              accept.textContent = "Accept";
              accept.style.color = "white";
              accept.addEventListener("click", () => {
                // Update modal content
                withdrawModalBody.innerHTML =
                  "<p>Are you sure you want to accept the proposal?</p>";
                // Show the modal
                confirmWithdrawButton.innerHTML = "Accept";
                confirmWithdrawButton.className = "btn btn-primary";
                modalTitle.innerHTML = "Accept proposal";
                withdrawModal.show();
                confirmWithdrawButton.addEventListener("click", async () => {
                  // Perform the withdrawal action here
                  await updateDocument1(docId);
                  withdrawModal.hide();
                });
              });

              const reject = document.createElement("a");
              reject.href = "#";
              reject.className = "btn btn-danger";
              reject.textContent = "Reject";
              reject.style.color = "white";
              reject.addEventListener("click", () => {
                // Update modal content
                withdrawModalBody.innerHTML =
                  "<p>Are you sure you want to reject the proposal?</p>";
                // Show the modal
                confirmWithdrawButton.innerHTML = "Reject";
                confirmWithdrawButton.className = "btn btn-danger";
                modalTitle.innerHTML = "Reject proposal";
                withdrawModal.show();
                // Set up event listener for Confirm Withdraw button in the modal
                confirmWithdrawButton.addEventListener("click", async () => {
                  // Perform the withdrawal action here
                  await updateDocument(docId);
                  withdrawModal.hide();
                });
              });
              cardBody.appendChild(title);
              cardBody.appendChild(qualification);
              cardBody.appendChild(experience);
              cardBody.appendChild(amount);
              cardBody.appendChild(status);
              cardBody.appendChild(accept);
              cardBody.appendChild(reject);

              card.appendChild(cardBody);
              cardDiv.appendChild(card);

              cardContainer.appendChild(cardDiv);
            }

            async function fetchDataFromFirestore() {
              const proposalsCollection = collection(db, "proposals");

              const q = query(
                proposalsCollection,
                where("student_id", "==", currentUser.uid),
                where("status", "in", ["accepted", "pending"]),
                orderBy("created_at", "desc")
              );

              const querySnapshot = await getDocs(q);

              querySnapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id;
                createCard(data, docId);
              });
            }
            fetchDataFromFirestore();
            async function updateDocument(docId) {
              const proposalsCollection = collection(db, "proposals");
              const docRef = doc(proposalsCollection, docId);
          
              await updateDoc(docRef, {
                  status: "rejected",
              });
              const cardDiv = document.getElementById(`card-${docId}`);
                if (cardDiv) {
                  cardDiv.remove();
                }
          }
            async function updateDocument1(docId) {
              const proposalsCollection = collection(db, "proposals");
              const docRef = doc(proposalsCollection, docId);
          
              await updateDoc(docRef, {
                  status: "accepted",
              });
          }
          }
        } else if (userType === "teacher") {
          document.getElementById(
            "usernamePlaceholder"
          ).innerHTML = `Teacher: ${username}`;
          document.getElementById("requestTeacherLink").remove();

          if (window.location.href.includes("dashboard.html")) {
            const cardContainer = document.getElementById("cardContainer");
            const cardContainer1 = document.getElementById("cardContainer1");

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

            function createProposalCard(data1) {
              const cardDiv1 = document.createElement("div");
              cardDiv1.className = "col-md-4 mb-4";

              const card1 = document.createElement("div");
              card1.className = "card custom-card";

              const cardBody1 = document.createElement("div");
              cardBody1.className = "card-body";

              const title1 = document.createElement("h5");
              title1.className = "card-title";
              title1.textContent = data1.subject;

              const qualification = document.createElement("p");
              qualification.className = "card-text";
              qualification.textContent = `Qualification: ${data1.qualification}`;

              const experience = document.createElement("p");
              experience.className = "card-text";
              experience.textContent = `Experience: ${data1.experience}`;

              const amount1 = document.createElement("p");
              amount1.className = "card-text";
              amount1.textContent = `PKR ${data1.amount}`;

              cardBody1.appendChild(title1);
              cardBody1.appendChild(qualification);
              cardBody1.appendChild(experience);
              cardBody1.appendChild(amount1);

              card1.appendChild(cardBody1);
              cardDiv1.appendChild(card1);

              cardContainer1.appendChild(cardDiv1);
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

              const proposalsCollection = collection(db, "proposals");
              const q1 = query(
                proposalsCollection,
                orderBy("created_at", "desc"),
                limit(3)
              );
              const querySnapshot1 = await getDocs(q1);
              querySnapshot1.forEach((doc) => {
                const data1 = doc.data();
                createProposalCard(data1);
              });
            }

            fetchDataFromFirestore();
          } else if (window.location.href.includes("allrequests.html")) {
            const cardContainer = document.getElementById("cardContainer");
            document.querySelector(".add-more").remove();
            const modal = new bootstrap.Modal(
              document.getElementById("exampleModal")
            );
            // Function to create a card with data
            function createCard(data, docId, studentId, subject) {
              const cardDiv = document.createElement("div");
              cardDiv.className = "col-md-4 mb-4";
              cardDiv.id = `${docId}`;

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
              sendProposal.addEventListener("click", (e) => {
                e.preventDefault();
                // Open the modal
                modal.show();

                // Set up an event listener for the form submission in the modal
                const reqForm = document.querySelector(".reqModal");
                reqForm.addEventListener("submit", async (e) => {
                  e.preventDefault();

                  // Get values from the form fields
                  const qualification =
                    document.getElementById("recipient-name").value;
                  const experience =
                    document.getElementById("description").value;
                  const amount = document.getElementById("amount").value;

                  // Create a new document in Firestore
                  const proposal = collection(db, "proposals");
                  await addDoc(proposal, {
                    request_id: docId,
                    user_id: currentUser.uid,
                    student_id: studentId,
                    status: "Pending",
                    subject: subject,
                    qualification: qualification,
                    experience: experience,
                    amount: amount,
                    created_at: serverTimestamp(), // You can add a timestamp for the created date
                  });

                  modal.hide();
                });
              });

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
                const docId = doc.id;
                const studentId = data.user_id;
                const subject = data.subject;
                createCard(data, docId, studentId, subject);
              });
            }

            fetchDataFromFirestore();
          } else if (window.location.href.includes("allproposals.html")) {
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

              const qualification = document.createElement("p");
              qualification.className = "card-text";
              qualification.textContent = `Qualification: ${data.qualification}`;

              const experience = document.createElement("p");
              experience.className = "card-text";
              experience.textContent = `Experience: ${data.experience}`;

              const amount = document.createElement("p");
              amount.className = "card-text";
              amount.textContent = `PKR ${data.amount}`;

              const status = document.createElement("p");
              status.className = "card-text";
              status.textContent = `Status: ${data.status}`;

              const withdraw = document.createElement("a");
              withdraw.href = "#";
              withdraw.className = "btn btn-danger";
              withdraw.textContent = "Withdraw";
              withdraw.style.color = "white";
              withdraw.addEventListener("click", () => {
                // Update modal content
                withdrawModalBody.innerHTML =
                  "<p>Are you sure you want to withdraw the proposal?</p>";
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
              cardBody.appendChild(qualification);
              cardBody.appendChild(experience);
              cardBody.appendChild(amount);
              cardBody.appendChild(status);
              cardBody.appendChild(withdraw);

              card.appendChild(cardBody);
              cardDiv.appendChild(card);

              cardContainer.appendChild(cardDiv);
            }

            async function fetchDataFromFirestore() {
              const proposalsCollection = collection(db, "proposals");

              const q = query(
                proposalsCollection,
                where("user_id", "==", currentUser.uid),
                orderBy("created_at", "desc")
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
              const proposalsCollection = collection(db, "proposals");

              try {
                await deleteDoc(doc(proposalsCollection, docId));
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
