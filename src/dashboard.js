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
// Show loader when content is loading
// document.addEventListener("DOMContentLoaded", function() {
//     document.getElementById("loader").style.display = "block";
// });

// // Hide loader when content has finished loading
// window.addEventListener("load", function() {
//     document.getElementById("loader").style.display = "none";
// });

const screenSpinnerContainer = document.getElementById(
  "screen-spinner-container"
);
const toast = new bootstrap.Toast(document.querySelector(".toast"));

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
          document.getElementById("requestTeacherLink").remove();
          document.getElementById("requestTeacherLinkNav").remove();

          if (window.location.href.includes("dashboard.html")) {
            const cardContainer = document.getElementById("cardContainer");
            const cardContainer1 = document.getElementById("cardContainer1");
            const cardContainer2 = document.getElementById("cardContainer2");

            // Function to create a card with data
            function createCard(data) {
              const cardDiv = document.createElement("div");
              cardDiv.className = "col-md-4 mb-4";

              const card = document.createElement("div");
              card.className = "card custom-card";

              const cardBody = document.createElement("div");
              cardBody.className = "card-body";

              const title = document.createElement("h5");
              title.className = "card-title d-inline-block text-truncate";
              title.textContent = data.subject;
              title.setAttribute("data-toggle", "tooltip");
              title.setAttribute("title", data.subject);
              title.style = "max-width: 250px;";
              $(title).tooltip();

              const description = document.createElement("p");
              description.className = "card-text";
              // Create a span element for the description text
              const descriptionText = document.createElement("p");
              descriptionText.textContent = `Description: ${data.description}`;
              // Add tooltip attributes
              descriptionText.setAttribute("data-toggle", "tooltip");
              descriptionText.setAttribute("title", data.description);
              // Initialize tooltip
              descriptionText.className = "d-inline-block text-truncate";
              descriptionText.style = "max-width: 250px;";

              $(descriptionText).tooltip();

              description.appendChild(descriptionText);

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
              cardDiv1.className = "col-md-4 mb-4 text-center";

              const card1 = document.createElement("div");
              card1.className = "card custom-card";

              const cardBody1 = document.createElement("div");
              cardBody1.className = "card-body";

              const title1 = document.createElement("h5");
              title1.className = "card-title d-inline-block text-truncate";
              title1.textContent = data1.subject;
              title1.setAttribute("data-toggle", "tooltip");
              title1.setAttribute("title", data1.subject);
              title1.style = "max-width: 250px;";
              $(title1).tooltip();

              const qualification = document.createElement("p");
              qualification.className = "card-text";
              // Create a span element for the qualification text
              const qualificationText = document.createElement("span");
              qualificationText.textContent = `Qualification: ${data1.qualification}`;
              // Add tooltip attributes
              qualificationText.setAttribute("data-toggle", "tooltip");
              qualificationText.setAttribute("title", data1.qualification);
              // Apply text-truncate class and max-width style
              qualificationText.className = "d-inline-block text-truncate";
              qualificationText.style = "max-width: 250px;";

              $(qualificationText).tooltip();

              // Append the qualificationText span to the qualification paragraph
              qualification.appendChild(qualificationText);

              const experience = document.createElement("p");
              experience.className = "card-text";
              // Create a span element for the experience text
              const experienceText = document.createElement("span");
              experienceText.textContent = `Experience: ${data1.experience}`;
              // Add tooltip attributes
              experienceText.setAttribute("data-toggle", "tooltip");
              experienceText.setAttribute("title", data1.experience);
              // Apply text-truncate class and max-width style
              experienceText.className = "d-inline-block text-truncate";
              experienceText.style = "max-width: 250px;";

              $(experienceText).tooltip();

              // Append the experienceText span to the experience paragraph
              experience.appendChild(experienceText);

              const status = document.createElement("p");
              status.innerHTML = `Status: <span style="color: ${
                data1.status == "pending"
                  ? "orange"
                  : data1.status == "accepted"
                  ? "green"
                  : "red"
              }">${data1.status}</span>`;

              const amount1 = document.createElement("p");
              amount1.className = "card-text";
              amount1.textContent = `PKR ${data1.amount}`;

              cardBody1.appendChild(title1);
              cardBody1.appendChild(qualification);
              cardBody1.appendChild(experience);
              cardBody1.appendChild(amount1);
              cardBody1.appendChild(status);

              card1.appendChild(cardBody1);
              cardDiv1.appendChild(card1);

              cardContainer1.appendChild(cardDiv1);
            }
            function createConnectionCard(data2) {
              const cardDiv2 = document.createElement("div");
              cardDiv2.className = "col-md-4 mb-4";

              const card2 = document.createElement("div");
              card2.className = "card custom-card";

              const cardBody2 = document.createElement("div");
              cardBody2.className = "card-body";

              const title2 = document.createElement("h5");
              title2.className = "card-title d-inline-block text-truncate";
              title2.textContent = data2.subject;
              title2.setAttribute("data-toggle", "tooltip");
              title2.setAttribute("title", data2.subject);
              title2.style = "max-width: 250px;";
              $(title2).tooltip();

              const teacher = document.createElement("p");
              teacher.className = "card-title";
              teacher.textContent = `Teacher: ${data2.teacher_name}`;

              const student = document.createElement("p");
              student.className = "card-title";
              student.textContent = `Student: ${data2.student_name}`;

              const amount2 = document.createElement("p");
              amount2.className = "card-text";
              amount2.textContent = `PKR ${data2.amount}`;

              cardBody2.appendChild(title2);
              cardBody2.appendChild(teacher);
              cardBody2.appendChild(student);
              cardBody2.appendChild(amount2);

              card2.appendChild(cardBody2);
              cardDiv2.appendChild(card2);

              cardContainer2.appendChild(cardDiv2);
              screenSpinnerContainer.style.display = "none";
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
              const connections = collection(db, "connections");
              const q2 = query(
                connections,
                orderBy("created", "desc"),
                limit(3)
              );
              const querySnapshot2 = await getDocs(q2);
              querySnapshot2.forEach((doc) => {
                const data2 = doc.data();
                createConnectionCard(data2);
              });
            }
            fetchDataFromFirestore();
          } else if (window.location.href.includes("allrequests.html")) {
            const cardContainer = document.getElementById("cardContainer");
            document.querySelector(".add-more").remove();
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
              title.className = "card-title d-inline-block text-truncate";
              title.textContent = data.subject;
              title.setAttribute("data-toggle", "tooltip");
              title.setAttribute("title", data.subject);
              title.style = "max-width: 250px;";
              $(title).tooltip();

              const description = document.createElement("p");
              description.className = "card-text";
              // Create a span element for the description text
              const descriptionText = document.createElement("p");
              descriptionText.textContent = `Description: ${data.description}`;
              // Add tooltip attributes
              descriptionText.setAttribute("data-toggle", "tooltip");
              descriptionText.setAttribute("title", data.description);
              // Initialize tooltip
              descriptionText.className = "d-inline-block text-truncate";
              descriptionText.style = "max-width: 250px;";

              $(descriptionText).tooltip();

              description.appendChild(descriptionText);

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
              screenSpinnerContainer.style.display = "none";
            }

            async function fetchDataFromFirestore() {
              const requestsCollection = collection(db, "requests");

              const q = query(requestsCollection, orderBy("created", "desc"));

              const querySnapshot = await getDocs(q);

              querySnapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id;
                createCard(data, docId);
              });
            }
            fetchDataFromFirestore();
          } else if (window.location.href.includes("allproposals.html")) {
            const cardContainer = document.getElementById("cardContainer");
            const filter = document.getElementById("statusFilter");
            // Function to create a card with data
            function createCard(data, docId) {
              const cardDiv = document.createElement("div");
              cardDiv.id = `card-${docId}`;
              cardDiv.className = "col-md-4 mb-4 text-center";

              const card = document.createElement("div");
              card.className = "card custom-card";

              const cardBody = document.createElement("div");
              cardBody.className = "card-body";

              const title = document.createElement("h5");
              title.className = "card-title d-inline-block text-truncate";
              title.textContent = data.subject;
              title.setAttribute("data-toggle", "tooltip");
              title.setAttribute("title", data.subject);
              title.style = "max-width: 250px;";
              $(title).tooltip();

              const qualification = document.createElement("p");
              qualification.className = "card-text";
              // Create a span element for the qualification text
              const qualificationText = document.createElement("span");
              qualificationText.textContent = `Qualification: ${data.qualification}`;
              // Add tooltip attributes
              qualificationText.setAttribute("data-toggle", "tooltip");
              qualificationText.setAttribute("title", data.qualification);
              // Apply text-truncate class and max-width style
              qualificationText.className = "d-inline-block text-truncate";
              qualificationText.style = "max-width: 250px;";

              $(qualificationText).tooltip();

              // Append the qualificationText span to the qualification paragraph
              qualification.appendChild(qualificationText);

              const experience = document.createElement("p");
              experience.className = "card-text";
              // Create a span element for the experience text
              const experienceText = document.createElement("span");
              experienceText.textContent = `Experience: ${data.experience}`;
              // Add tooltip attributes
              experienceText.setAttribute("data-toggle", "tooltip");
              experienceText.setAttribute("title", data.experience);
              // Apply text-truncate class and max-width style
              experienceText.className = "d-inline-block text-truncate";
              experienceText.style = "max-width: 250px;";

              $(experienceText).tooltip();

              // Append the experienceText span to the experience paragraph
              experience.appendChild(experienceText);

              const status = document.createElement("p");
              status.innerHTML = `Status: <span style="color: ${
                data.status == "pending"
                  ? "orange"
                  : data.status == "accepted"
                  ? "green"
                  : "red"
              }">${data.status}</span>`;

              const amount = document.createElement("p");
              amount.className = "card-text";
              amount.textContent = `PKR ${data.amount}`;

              cardBody.appendChild(title);
              cardBody.appendChild(qualification);
              cardBody.appendChild(experience);
              cardBody.appendChild(amount);
              cardBody.appendChild(status);
              card.appendChild(cardBody);
              cardDiv.appendChild(card);
              cardContainer.appendChild(cardDiv);
              screenSpinnerContainer.style.display = "none";
            }

            filter.addEventListener("change", (e) => {
              e.preventDefault();
              fetchDataFromFirestore(filter.value);
            });

            async function fetchDataFromFirestore() {
              const proposalsCollection = collection(db, "proposals");

              if (filter.value === "Pending") {
                cardContainer.innerHTML = "";
                const q = query(
                  proposalsCollection,
                  where("status", "==", "pending"),
                  orderBy("created_at", "desc")
                );
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  const docId = doc.id;
                  createCard(data, docId);
                });
              } else if (filter.value === "Accepted") {
                cardContainer.innerHTML = "";
                const q = query(
                  proposalsCollection,
                  where("status", "==", "accepted"),
                  orderBy("created_at", "desc")
                );
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  const docId = doc.id;
                  createCard(data, docId);
                });
              } else if (filter.value === "Rejected") {
                cardContainer.innerHTML = "";
                const q = query(
                  proposalsCollection,
                  where("status", "==", "rejected"),
                  orderBy("created_at", "desc")
                );
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  const docId = doc.id;
                  createCard(data, docId);
                });
              } else {
                cardContainer.innerHTML = "";
                const q = query(
                  proposalsCollection,
                  orderBy("created_at", "desc")
                );
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  const docId = doc.id;
                  createCard(data, docId);
                });
              }
            }
            fetchDataFromFirestore();
          } else if (window.location.href.includes("connections.html")) {
            const cardContainer = document.getElementById("cardContainer");
            // Function to create a card with data
            function createCard(data) {
              const cardDiv = document.createElement("div");
              cardDiv.className = "col-md-4 mb-4 text-center";

              const card = document.createElement("div");
              card.className = "card custom-card";

              const cardBody = document.createElement("div");
              cardBody.className = "card-body";

              const title = document.createElement("h5");
              title.className = "card-title d-inline-block text-truncate";
              title.textContent = data.subject;
              title.setAttribute("data-toggle", "tooltip");
              title.setAttribute("title", data.subject);
              title.style = "max-width: 250px;";
              $(title).tooltip();

              const amount = document.createElement("p");
              amount.className = "card-text";
              amount.textContent = `PKR ${data.amount}`;

              const payment = document.createElement("p");
              payment.className = "card-text";
              payment.innerHTML = `Payment: <span style="color: ${
                data.payment == "pending" ? "orange" : "green"
              }">${data.payment}</span>`;

              cardBody.appendChild(title);
              cardBody.appendChild(amount);
              cardBody.appendChild(payment);

              card.appendChild(cardBody);
              cardDiv.appendChild(card);

              cardContainer.appendChild(cardDiv);
              screenSpinnerContainer.style.display = "none";
            }

            async function fetchDataFromFirestore() {
              const connections = collection(db, "connections");

              const q = query(connections, orderBy("created", "desc"));

              const querySnapshot = await getDocs(q);

              querySnapshot.forEach((doc) => {
                const data = doc.data();
                createCard(data);
              });
            }
            fetchDataFromFirestore();
          }
        } else if (userType === "student") {
          document.getElementById(
            "usernamePlaceholder"
          ).innerHTML = `Student: ${username}`;

          if (
            window.location.href.includes("dashboard.html") ||
            window.location.href.includes("request.html")
          ) {
            if (window.location.href.includes("request.html")) {
              screenSpinnerContainer.style.display = "none";
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
                  username: username,
                  description: description,
                  amount: amount,
                  timeFrom: formattedTimeFrom,
                  timeTo: formattedTimeTo,
                  created: serverTimestamp(),
                }).catch((error) => {
                  console.error("Error adding document: ", error);
                });

                requestForm.reset();
                document.querySelector("#loginToast .toast-body").innerText =
                    "Request added successfully!";
                  toast.show();
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
              const cardContainer2 = document.getElementById("cardContainer2");

              // Function to create a card with data
              function createCard(data) {
                const cardDiv = document.createElement("div");
                cardDiv.className = "col-md-4 mb-4";

                const card = document.createElement("div");
                card.className = "card custom-card";

                const cardBody = document.createElement("div");
                cardBody.className = "card-body";

                const title = document.createElement("h5");
                title.className = "card-title d-inline-block text-truncate";
                title.textContent = data.subject;
                title.setAttribute("data-toggle", "tooltip");
                title.setAttribute("title", data.subject);
                title.style = "max-width: 250px;";
                $(title).tooltip();

                const description = document.createElement("p");
                description.className = "card-text";
                // Create a span element for the description text
                const descriptionText = document.createElement("p");
                descriptionText.textContent = `Description: ${data.description}`;
                // Add tooltip attributes
                descriptionText.setAttribute("data-toggle", "tooltip");
                descriptionText.setAttribute("title", data.description);
                // Initialize tooltip
                descriptionText.className = "d-inline-block text-truncate";
                descriptionText.style = "max-width: 250px;";

                $(descriptionText).tooltip();

                description.appendChild(descriptionText);

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
                title1.className = "card-title d-inline-block text-truncate";
                title1.textContent = data1.subject;
                title1.setAttribute("data-toggle", "tooltip");
                title1.setAttribute("title", data1.subject);
                title1.style = "max-width: 250px;";
                $(title1).tooltip();

                const qualification = document.createElement("p");
                qualification.className = "card-text";
                // Create a span element for the qualification text
                const qualificationText = document.createElement("span");
                qualificationText.textContent = `Qualification: ${data1.qualification}`;
                // Add tooltip attributes
                qualificationText.setAttribute("data-toggle", "tooltip");
                qualificationText.setAttribute("title", data1.qualification);
                // Apply text-truncate class and max-width style
                qualificationText.className = "d-inline-block text-truncate";
                qualificationText.style = "max-width: 250px;";

                $(qualificationText).tooltip();

                // Append the qualificationText span to the qualification paragraph
                qualification.appendChild(qualificationText);

                const experience = document.createElement("p");
                experience.className = "card-text";
                // Create a span element for the experience text
                const experienceText = document.createElement("span");
                experienceText.textContent = `Experience: ${data1.experience}`;
                // Add tooltip attributes
                experienceText.setAttribute("data-toggle", "tooltip");
                experienceText.setAttribute("title", data1.experience);
                // Apply text-truncate class and max-width style
                experienceText.className = "d-inline-block text-truncate";
                experienceText.style = "max-width: 250px;";

                $(experienceText).tooltip();

                // Append the experienceText span to the experience paragraph
                experience.appendChild(experienceText);

                const status = document.createElement("p");
                status.className = "card-text";
                status.textContent = `Status: ${data1.status}`;

                const amount1 = document.createElement("p");
                amount1.className = "card-text";
                amount1.textContent = `PKR ${data1.amount}`;

                cardBody1.appendChild(title1);
                cardBody1.appendChild(qualification);
                cardBody1.appendChild(experience);
                cardBody1.appendChild(amount1);
                cardBody1.appendChild(status);

                card1.appendChild(cardBody1);
                cardDiv1.appendChild(card1);

                cardContainer1.appendChild(cardDiv1);
              }
              function createConnectionCard(data2) {
                const cardDiv2 = document.createElement("div");
                cardDiv2.className = "col-md-4 mb-4";

                const card2 = document.createElement("div");
                card2.className = "card custom-card";

                const cardBody2 = document.createElement("div");
                cardBody2.className = "card-body";

                const title2 = document.createElement("h5");
                title2.className = "card-title d-inline-block text-truncate";
                title2.textContent = data2.subject;
                title2.setAttribute("data-toggle", "tooltip");
                title2.setAttribute("title", data2.subject);
                title2.style = "max-width: 250px;";
                $(title2).tooltip();

                const teacher = document.createElement("p");
                teacher.className = "card-title";
                teacher.textContent = `Teacher: ${data2.teacher_name}`;

                const amount2 = document.createElement("p");
                amount2.className = "card-text";
                amount2.textContent = `PKR ${data2.amount}`;

                cardBody2.appendChild(title2);
                cardBody2.appendChild(teacher);
                cardBody2.appendChild(amount2);

                card2.appendChild(cardBody2);
                cardDiv2.appendChild(card2);

                cardContainer2.appendChild(cardDiv2);
              }
              screenSpinnerContainer.style.display = "none";
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
                  where("student_id", "==", currentUser.uid),
                  orderBy("created_at", "desc"),
                  limit(3)
                );
                const querySnapshot1 = await getDocs(q1);
                querySnapshot1.forEach((doc) => {
                  const data1 = doc.data();
                  createProposalCard(data1);
                });
                const connections = collection(db, "connections");
                const q2 = query(
                  connections,
                  where("student_id", "==", currentUser.uid),
                  orderBy("created", "desc"),
                  limit(3)
                );
                const querySnapshot2 = await getDocs(q2);
                querySnapshot2.forEach((doc) => {
                  const data2 = doc.data();
                  createConnectionCard(data2);
                });
              }
              fetchDataFromFirestore();
            }
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
              title.className = "card-title d-inline-block text-truncate";
              title.textContent = data.subject;
              title.setAttribute("data-toggle", "tooltip");
              title.setAttribute("title", data.subject);
              title.style = "max-width: 250px;";
              $(title).tooltip();

              const description = document.createElement("p");
              description.className = "card-text";
              // Create a span element for the description text
              const descriptionText = document.createElement("p");
              descriptionText.textContent = `Description: ${data.description}`;
              // Add tooltip attributes
              descriptionText.setAttribute("data-toggle", "tooltip");
              descriptionText.setAttribute("title", data.description);
              // Initialize tooltip
              descriptionText.className = "d-inline-block text-truncate";
              descriptionText.style = "max-width: 250px;";

              $(descriptionText).tooltip();

              description.appendChild(descriptionText);

              const time = document.createElement("p");
              time.className = "card-text";
              time.textContent = `Time slot: ${data.timeFrom} - ${data.timeTo}`;

              const amount = document.createElement("p");
              amount.className = "card-text";
              amount.textContent = `PKR ${data.amount}`;

              const withdraw = document.createElement("a");
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
                confirmWithdrawButton.addEventListener("click", async (e) => {
                  e.preventDefault();
                  loader.classList.remove("visually-hidden");
                  confirmWithdrawButton.innerHTML = "";
                  confirmWithdrawButton.appendChild(loader);
                  confirmWithdrawButton.disabled = false;
                  await deleteDocument(docId);
                  document.querySelector("#loginToast .toast-body").innerText =
                    "Withdrawn request successfully!";
                  toast.show();

                  confirmWithdrawButton.disabled = false;
                  confirmWithdrawButton.innerHTML = "Withdraw";
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
            screenSpinnerContainer.style.display = "none";

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
            const filter = document.getElementById("statusFilter");
            const optionalOption = document.getElementById("optionalOption");
            optionalOption.remove();
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
              cardDiv.className = "col-md-4 mb-4 text-center";

              const card = document.createElement("div");
              card.className = "card custom-card";

              const cardBody = document.createElement("div");
              cardBody.className = "card-body";

              const title = document.createElement("h5");
              title.className = "card-title d-inline-block text-truncate";
              title.textContent = data.subject;
              title.setAttribute("data-toggle", "tooltip");
              title.setAttribute("title", data.subject);
              title.style = "max-width: 250px;";
              $(title).tooltip();

              const qualification = document.createElement("p");
              qualification.className = "card-text";
              // Create a span element for the qualification text
              const qualificationText = document.createElement("span");
              qualificationText.textContent = `Qualification: ${data.qualification}`;
              // Add tooltip attributes
              qualificationText.setAttribute("data-toggle", "tooltip");
              qualificationText.setAttribute("title", data.qualification);
              // Apply text-truncate class and max-width style
              qualificationText.className = "d-inline-block text-truncate";
              qualificationText.style = "max-width: 250px;";

              $(qualificationText).tooltip();

              // Append the qualificationText span to the qualification paragraph
              qualification.appendChild(qualificationText);

              const experience = document.createElement("p");
              experience.className = "card-text";
              // Create a span element for the experience text
              const experienceText = document.createElement("span");
              experienceText.textContent = `Experience: ${data.experience}`;
              // Add tooltip attributes
              experienceText.setAttribute("data-toggle", "tooltip");
              experienceText.setAttribute("title", data.experience);
              // Apply text-truncate class and max-width style
              experienceText.className = "d-inline-block text-truncate";
              experienceText.style = "max-width: 250px;";

              $(experienceText).tooltip();

              // Append the experienceText span to the experience paragraph
              experience.appendChild(experienceText);

              const status = document.createElement("p");
              status.className = "card-text updateStatus";
              status.innerHTML = `Status: <span style="color: ${
                data.status == "pending" ? "orange" : "green"
              }">${data.status}</span>`;

              const amount = document.createElement("p");
              amount.className = "card-text";
              amount.textContent = `PKR ${data.amount}`;

              cardBody.appendChild(title);
              cardBody.appendChild(qualification);
              cardBody.appendChild(experience);
              cardBody.appendChild(amount);
              cardBody.appendChild(status);
              if (data.status === "pending") {
                const accept = document.createElement("a");
                accept.className = "btn btn-primary me-2";
                accept.textContent = "Accept";
                accept.style.color = "white";

                const reject = document.createElement("a");
                reject.className = "btn btn-danger";
                reject.textContent = "Reject";
                reject.style.color = "white";

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

                    loader.classList.remove("visually-hidden");
                    confirmWithdrawButton.innerHTML = "";
                    confirmWithdrawButton.appendChild(loader);
                    confirmWithdrawButton.disabled = false;

                    addDoc(collection(db, "connections"), {
                      subject: data.subject,
                      student_id: currentUser.uid,
                      teacher_id: data.user_id,
                      payment: "pending",
                      teacher_name: data.teacher_name,
                      student_name: data.student_name,
                      amount: data.amount,
                      created: serverTimestamp(),
                    }).catch((error) => {
                      console.error("Error adding document: ", error);
                    });
                    document.querySelector("#loginToast .toast-body").innerText =
                    "Proposal accepted!";
                  toast.show();
                    const updateStatus =
                      document.querySelector(".updateStatus");
                    status.className = "card-text";
                    await updateDocument1(docId);
                    updateStatus.innerHTML = `Status: <span style="color: green">accepted</span>`;
                    confirmWithdrawButton.disabled = false;
                    confirmWithdrawButton.innerHTML = "Accept";
                    withdrawModal.hide();
                    accept.remove();
                    reject.remove();
                  });
                });

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
                    loader.classList.remove("visually-hidden");
                    confirmWithdrawButton.innerHTML = "";
                    confirmWithdrawButton.appendChild(loader);
                    confirmWithdrawButton.disabled = false;
                    await updateDocument(docId);
                    document.querySelector("#loginToast .toast-body").innerText =
                    "Proposal rejected successfully!";
                  toast.show();
                    confirmWithdrawButton.disabled = false;
                    confirmWithdrawButton.innerHTML = "Submit Request";
                    withdrawModal.hide();
                  });
                });
                cardBody.appendChild(accept);
                cardBody.appendChild(reject);
              }

              card.appendChild(cardBody);
              cardDiv.appendChild(card);

              cardContainer.appendChild(cardDiv);
            }
            screenSpinnerContainer.style.display = "none";

            filter.addEventListener("change", (e) => {
              e.preventDefault();
              fetchDataFromFirestore(filter.value);
            });

            async function fetchDataFromFirestore() {
              const proposalsCollection = collection(db, "proposals");

              if (filter.value === "Pending") {
                cardContainer.innerHTML = "";
                const q = query(
                  proposalsCollection,
                  where("student_id", "==", currentUser.uid),
                  where("status", "==", "pending"),
                  orderBy("created_at", "desc")
                );
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  const docId = doc.id;
                  createCard(data, docId);
                });
              } else if (filter.value === "Accepted") {
                cardContainer.innerHTML = "";
                const q = query(
                  proposalsCollection,
                  where("student_id", "==", currentUser.uid),
                  where("status", "==", "accepted"),
                  orderBy("created_at", "desc")
                );
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  const docId = doc.id;
                  createCard(data, docId);
                });
              } else {
                cardContainer.innerHTML = "";
                const q = query(
                  proposalsCollection,
                  where("student_id", "==", currentUser.uid),
                  where("status", "in", ["pending", "accepted"]),
                  orderBy("created_at", "desc")
                );
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  const docId = doc.id;
                  createCard(data, docId);
                });
              }
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
          } else if (window.location.href.includes("connections.html")) {
            const cardContainer = document.getElementById("cardContainer");
            // Function to create a card with data
            function createCard(data) {
              const cardDiv = document.createElement("div");
              cardDiv.className = "col-md-4 mb-4 text-center";

              const card = document.createElement("div");
              card.className = "card custom-card";

              const cardBody = document.createElement("div");
              cardBody.className = "card-body";

              const title = document.createElement("h5");
              title.className = "card-title d-inline-block text-truncate";
              title.textContent = data.subject;
              title.setAttribute("data-toggle", "tooltip");
              title.setAttribute("title", data.subject);
              title.style = "max-width: 250px;";
              $(title).tooltip();

              const teacher = document.createElement("p");
              teacher.className = "card-title";
              teacher.textContent = `Teacher: ${data.teacher_name}`;

              const amount = document.createElement("p");
              amount.className = "card-text";
              amount.textContent = `PKR ${data.amount}`;

              cardBody.appendChild(title);
              cardBody.appendChild(teacher);
              cardBody.appendChild(amount);

              card.appendChild(cardBody);
              cardDiv.appendChild(card);

              cardContainer.appendChild(cardDiv);
            }
            screenSpinnerContainer.style.display = "none";

            async function fetchDataFromFirestore() {
              const connections = collection(db, "connections");

              const q = query(
                connections,
                where("student_id", "==", currentUser.uid),
                orderBy("created", "desc")
              );

              const querySnapshot = await getDocs(q);

              querySnapshot.forEach((doc) => {
                const data = doc.data();
                createCard(data);
              });
            }
            fetchDataFromFirestore();
          }
        } else if (userType === "teacher") {
          document.getElementById(
            "usernamePlaceholder"
          ).innerHTML = `Teacher: ${username}`;
          document.getElementById("requestTeacherLink").remove();
          document.getElementById("requestTeacherLinkNav").remove();

          if (window.location.href.includes("dashboard.html")) {
            const cardContainer = document.getElementById("cardContainer");
            const cardContainer1 = document.getElementById("cardContainer1");
            const cardContainer2 = document.getElementById("cardContainer2");

            // Function to create a card with data
            function createCard(data) {
              const cardDiv = document.createElement("div");
              cardDiv.className = "col-md-4 mb-4";

              const card = document.createElement("div");
              card.className = "card custom-card";

              const cardBody = document.createElement("div");
              cardBody.className = "card-body";

              const title = document.createElement("h5");
              title.className = "card-title d-inline-block text-truncate";
              title.textContent = data.subject;
              title.setAttribute("data-toggle", "tooltip");
              title.setAttribute("title", data.subject);
              title.style = "max-width: 250px;";
              $(title).tooltip();

              const description = document.createElement("p");
              description.className = "card-text";
              // Create a span element for the description text
              const descriptionText = document.createElement("p");
              descriptionText.textContent = `Description: ${data.description}`;
              // Add tooltip attributes
              descriptionText.setAttribute("data-toggle", "tooltip");
              descriptionText.setAttribute("title", data.description);
              // Initialize tooltip
              descriptionText.className = "d-inline-block text-truncate";
              descriptionText.style = "max-width: 250px;";

              $(descriptionText).tooltip();

              description.appendChild(descriptionText);

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
              title1.className = "card-title d-inline-block text-truncate";
              title1.textContent = data1.subject;
              title1.setAttribute("data-toggle", "tooltip");
              title1.setAttribute("title", data1.subject);
              title1.style = "max-width: 250px;";
              $(title1).tooltip();

              const qualification = document.createElement("p");
              qualification.className = "card-text";
              // Create a span element for the qualification text
              const qualificationText = document.createElement("span");
              qualificationText.textContent = `Qualification: ${data1.qualification}`;
              // Add tooltip attributes
              qualificationText.setAttribute("data-toggle", "tooltip");
              qualificationText.setAttribute("title", data1.qualification);
              // Apply text-truncate class and max-width style
              qualificationText.className = "d-inline-block text-truncate";
              qualificationText.style = "max-width: 250px;";

              $(qualificationText).tooltip();

              // Append the qualificationText span to the qualification paragraph
              qualification.appendChild(qualificationText);

              const experience = document.createElement("p");
              experience.className = "card-text";
              // Create a span element for the experience text
              const experienceText = document.createElement("span");
              experienceText.textContent = `Experience: ${data1.experience}`;
              // Add tooltip attributes
              experienceText.setAttribute("data-toggle", "tooltip");
              experienceText.setAttribute("title", data1.experience);
              // Apply text-truncate class and max-width style
              experienceText.className = "d-inline-block text-truncate";
              experienceText.style = "max-width: 250px;";

              $(experienceText).tooltip();

              // Append the experienceText span to the experience paragraph
              experience.appendChild(experienceText);

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
            function createConnectionCard(data2) {
              const cardDiv2 = document.createElement("div");
              cardDiv2.className = "col-md-4 mb-4";

              const card2 = document.createElement("div");
              card2.className = "card custom-card";

              const cardBody2 = document.createElement("div");
              cardBody2.className = "card-body";

              const title2 = document.createElement("h5");
              title2.className = "card-title d-inline-block text-truncate";
              title2.textContent = data2.subject;
              title2.setAttribute("data-toggle", "tooltip");
              title2.setAttribute("title", data2.subject);
              title2.style = "max-width: 250px;";
              $(title2).tooltip();

              const student = document.createElement("p");
              student.className = "card-title";
              student.textContent = `Student: ${data2.student_name}`;

              const payment = document.createElement("p");
              payment.className = "card-text";
              payment.innerHTML = `Payment: <span style="color: ${
                data2.payment == "pending" ? "orange" : "green"
              }">${data2.payment}</span>`;

              const amount2 = document.createElement("p");
              amount2.className = "card-text";
              amount2.textContent = `PKR ${data2.amount}`;

              cardBody2.appendChild(title2);
              cardBody2.appendChild(student);
              cardBody2.appendChild(payment);
              cardBody2.appendChild(amount2);

              card2.appendChild(cardBody2);
              cardDiv2.appendChild(card2);

              cardContainer2.appendChild(cardDiv2);
            }
            screenSpinnerContainer.style.display = "none";

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
                where("user_id", "==", currentUser.uid),
                orderBy("created_at", "desc"),
                limit(3)
              );
              const querySnapshot1 = await getDocs(q1);
              querySnapshot1.forEach((doc) => {
                const data1 = doc.data();
                createProposalCard(data1);
              });
              const connections = collection(db, "connections");
              const q2 = query(
                connections,
                where("teacher_id", "==", currentUser.uid),
                orderBy("created", "desc"),
                limit(3)
              );
              const querySnapshot2 = await getDocs(q2);
              querySnapshot2.forEach((doc) => {
                const data2 = doc.data();
                createConnectionCard(data2);
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
            function createCard(data, docId, studentId, subject, studentName) {
              const cardDiv = document.createElement("div");
              cardDiv.className = "col-md-4 mb-4";
              cardDiv.id = `${docId}`;

              const card = document.createElement("div");
              card.className = "card custom-card";

              const cardBody = document.createElement("div");
              cardBody.className = "card-body";

              const title = document.createElement("h5");
              title.className = "card-title d-inline-block text-truncate";
              title.textContent = data.subject;
              title.setAttribute("data-toggle", "tooltip");
              title.setAttribute("title", data.subject);
              title.style = "max-width: 250px;";
              $(title).tooltip();

              const description = document.createElement("p");
              description.className = "card-text";
              // Create a span element for the description text
              const descriptionText = document.createElement("p");
              descriptionText.textContent = `Description: ${data.description}`;
              // Add tooltip attributes
              descriptionText.setAttribute("data-toggle", "tooltip");
              descriptionText.setAttribute("title", data.description);
              // Initialize tooltip
              descriptionText.className = "d-inline-block text-truncate";
              descriptionText.style = "max-width: 250px;";

              $(descriptionText).tooltip();

              description.appendChild(descriptionText);

              const time = document.createElement("p");
              time.className = "card-text";
              time.textContent = `Time slot: ${data.timeFrom} - ${data.timeTo}`;

              const amount = document.createElement("p");
              amount.className = "card-text";
              amount.textContent = `PKR ${data.amount}`;

              const sendProposal = document.createElement("a");
              sendProposal.className = "btn btn-primary";
              sendProposal.textContent = "Send proposal";
              sendProposal.style.color = "white";
              sendProposal.addEventListener("click", (e) => {
                e.preventDefault();
                // Open the modal
                modal.show();

                // Set up an event listener for the form submission in the modal
                const reqForm = document.querySelector(".reqModal");
                const submitButton = document.querySelector(".generate-btn");
                reqForm.addEventListener("submit", async (e) => {
                  e.preventDefault();

                  loader.classList.remove("visually-hidden");
                  submitButton.innerHTML = "";
                  submitButton.appendChild(loader);
                  submitButton.disabled = false;
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
                    teacher_name: username,
                    student_name: studentName,
                    student_id: studentId,
                    status: "pending",
                    subject: subject,
                    qualification: qualification,
                    experience: experience,
                    amount: amount,
                    created_at: serverTimestamp(), // You can add a timestamp for the created date
                  });
                  document.querySelector("#loginToast .toast-body").innerText =
                    "Proposal sent successfully!";
                  toast.show();
                  submitButton.disabled = false;
                  submitButton.innerHTML = "Generate";
                  modal.hide();
                  window.location.href = "allproposals.html";
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
            screenSpinnerContainer.style.display = "none";

            async function fetchDataFromFirestore() {
              const requestsCollection = collection(db, "requests");

              const q = query(requestsCollection, orderBy("created", "desc"));

              const querySnapshot = await getDocs(q);

              querySnapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id;
                const studentId = data.user_id;
                const subject = data.subject;
                const studentName = data.username;
                createCard(data, docId, studentId, subject, studentName);
              });
            }

            fetchDataFromFirestore();
          } else if (window.location.href.includes("allproposals.html")) {
            const cardContainer = document.getElementById("cardContainer");
            const filter = document.getElementById("statusFilter");
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
              cardDiv.className = "col-md-4 mb-4 text-center";

              const card = document.createElement("div");
              card.className = "card custom-card";

              const cardBody = document.createElement("div");
              cardBody.className = "card-body";

              const title = document.createElement("h5");
              title.className = "card-title d-inline-block text-truncate";
              title.textContent = data.subject;
              title.setAttribute("data-toggle", "tooltip");
              title.setAttribute("title", data.subject);
              title.style = "max-width: 250px;";
              $(title).tooltip();

              const qualification = document.createElement("p");
              qualification.className = "card-text";
              // Create a span element for the qualification text
              const qualificationText = document.createElement("span");
              qualificationText.textContent = `Qualification: ${data.qualification}`;
              // Add tooltip attributes
              qualificationText.setAttribute("data-toggle", "tooltip");
              qualificationText.setAttribute("title", data.qualification);
              // Apply text-truncate class and max-width style
              qualificationText.className = "d-inline-block text-truncate";
              qualificationText.style = "max-width: 250px;";

              $(qualificationText).tooltip();

              // Append the qualificationText span to the qualification paragraph
              qualification.appendChild(qualificationText);

              const experience = document.createElement("p");
              experience.className = "card-text";
              // Create a span element for the experience text
              const experienceText = document.createElement("span");
              experienceText.textContent = `Experience: ${data.experience}`;
              // Add tooltip attributes
              experienceText.setAttribute("data-toggle", "tooltip");
              experienceText.setAttribute("title", data.experience);
              // Apply text-truncate class and max-width style
              experienceText.className = "d-inline-block text-truncate";
              experienceText.style = "max-width: 250px;";

              $(experienceText).tooltip();

              // Append the experienceText span to the experience paragraph
              experience.appendChild(experienceText);

              const description = document.createElement("p");
              description.className = "card-text";
              // Create a span element for the description text
              const descriptionText = document.createElement("p");
              descriptionText.textContent = `Description: ${data.description}`;
              // Add tooltip attributes
              descriptionText.setAttribute("data-toggle", "tooltip");
              descriptionText.setAttribute("title", data.description);
              // Initialize tooltip
              descriptionText.className = "d-inline-block text-truncate";
              descriptionText.style = "max-width: 250px;";

              $(descriptionText).tooltip();

              description.appendChild(descriptionText);

              const amount = document.createElement("p");
              amount.className = "card-text";
              amount.textContent = `PKR ${data.amount}`;

              const status = document.createElement("p");
              status.innerHTML = `Status: <span style="color: ${
                data.status == "pending"
                  ? "orange"
                  : data.status == "accepted"
                  ? "green"
                  : "red"
              }">${data.status}</span>`;

              cardBody.appendChild(title);
              cardBody.appendChild(qualification);
              cardBody.appendChild(experience);
              cardBody.appendChild(amount);
              cardBody.appendChild(status);
              if (data.status === "pending") {
                const withdraw = document.createElement("a");
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
                  confirmWithdrawButton.addEventListener("click", async (e) => {
                    e.preventDefault();

                    loader.classList.remove("visually-hidden");
                    confirmWithdrawButton.innerHTML = "";
                    confirmWithdrawButton.appendChild(loader);
                    confirmWithdrawButton.disabled = false;
                    await deleteDocument(docId);
                    document.querySelector("#loginToast .toast-body").innerText =
                    "Withdrawn proposal successfully!";
                  toast.show();
                    confirmWithdrawButton.disabled = false;
                    confirmWithdrawButton.innerHTML = "Withdraw";
                    withdrawModal.hide();
                  });
                });
                cardBody.appendChild(withdraw);
              }

              card.appendChild(cardBody);
              cardDiv.appendChild(card);

              cardContainer.appendChild(cardDiv);
            }
            screenSpinnerContainer.style.display = "none";
            filter.addEventListener("change", (e) => {
              e.preventDefault();
              fetchDataFromFirestore(filter.value);
            });

            async function fetchDataFromFirestore() {
              const proposalsCollection = collection(db, "proposals");

              if (filter.value === "Pending") {
                cardContainer.innerHTML = "";
                const q = query(
                  proposalsCollection,
                  where("user_id", "==", currentUser.uid),
                  where("status", "==", "pending"),
                  orderBy("created_at", "desc")
                );
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  const docId = doc.id;
                  createCard(data, docId);
                });
              } else if (filter.value === "Accepted") {
                cardContainer.innerHTML = "";
                const q = query(
                  proposalsCollection,
                  where("user_id", "==", currentUser.uid),
                  where("status", "==", "accepted"),
                  orderBy("created_at", "desc")
                );
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  const docId = doc.id;
                  createCard(data, docId);
                });
              } else if (filter.value === "Rejected") {
                cardContainer.innerHTML = "";
                const q = query(
                  proposalsCollection,
                  where("user_id", "==", currentUser.uid),
                  where("status", "==", "rejected"),
                  orderBy("created_at", "desc")
                );
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  const docId = doc.id;
                  createCard(data, docId);
                });
              } else {
                cardContainer.innerHTML = "";
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
          } else if (window.location.href.includes("connections.html")) {
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
              cardDiv.className = "col-md-4 mb-4 text-center";

              const card = document.createElement("div");
              card.className = "card custom-card";

              const cardBody = document.createElement("div");
              cardBody.className = "card-body";

              const title = document.createElement("h5");
              title.className = "card-title d-inline-block text-truncate";
              title.textContent = data.subject;
              title.setAttribute("data-toggle", "tooltip");
              title.setAttribute("title", data.subject);
              title.style = "max-width: 250px;";
              $(title).tooltip();

              const student = document.createElement("p");
              student.className = "card-title";
              student.textContent = `Student: ${data.student_name}`;

              const payment = document.createElement("p");
              payment.className = "card-text";
              payment.innerHTML = `Payment: <span style="color: ${
                data.payment == "pending" ? "orange" : "green"
              }">${data.payment}</span>`;

              const payAmount = document.createElement("p");
              payAmount.className = "card-text";
              payAmount.textContent = `Pay 10%:  PKR ${(
                (data.amount / 100) *
                10
              ).toFixed(0)}`;

              const amount = document.createElement("p");
              amount.className = "card-text";
              amount.textContent = `PKR ${data.amount}`;

              cardBody.appendChild(title);
              cardBody.appendChild(student);
              cardBody.appendChild(payment);
              cardBody.appendChild(amount);
              cardBody.appendChild(payAmount);
              if (data.payment == "pending") {
                const pay = document.createElement("a");
                pay.className = "btn btn-primary me-2";
                pay.textContent = "Pay";
                pay.style.color = "white";
                pay.addEventListener("click", (e) => {
                  e.preventDefault();

                  // Update modal content
                  withdrawModalBody.innerHTML =
                    "<p>Are you sure you want to pay the amount?</p>";
                  // Show the modal
                  confirmWithdrawButton.innerHTML = "Pay";
                  confirmWithdrawButton.className = "btn btn-primary";
                  modalTitle.innerHTML = "Payment confirmation";
                  withdrawModal.show();
                  // Set up event listener for Confirm Withdraw button in the modal
                  confirmWithdrawButton.addEventListener("click", async (e) => {
                    e.preventDefault();

                    loader.classList.remove("visually-hidden");
                    confirmWithdrawButton.innerHTML = "";
                    confirmWithdrawButton.appendChild(loader);
                    confirmWithdrawButton.disabled = false;
                    await updateDocument(docId);
                    document.querySelector("#loginToast .toast-body").innerText =
                    "Payment sent successfully!";
                    toast.show();
                    payment.innerHTML = `Payment: <span style="color: green">paid</span>`;
                    pay.remove();
                    confirmWithdrawButton.disabled = false;
                    confirmWithdrawButton.innerHTML = "Pay";
                    withdrawModal.hide();
                  });
                });

                cardBody.appendChild(pay);
              }

              card.appendChild(cardBody);
              cardDiv.appendChild(card);

              cardContainer.appendChild(cardDiv);
            }
            screenSpinnerContainer.style.display = "none";

            async function fetchDataFromFirestore() {
              const connections = collection(db, "connections");

              const q = query(
                connections,
                where("teacher_id", "==", currentUser.uid),
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
            async function updateDocument(docId) {
              const connectionsCollection = collection(db, "connections");
              const docRef = doc(connectionsCollection, docId);

              await updateDoc(docRef, {
                payment: "paid",
              });
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
let currentUrl = window.location.href;

// Get all links in the sidebar
let sidebarLinks = document.querySelectorAll(".sidebar-cont .nav-link");

// Loop through each link and check if its href matches the current URL
sidebarLinks.forEach(function (link) {
  if (link.href === currentUrl) {
    // Add the "active" class to the parent list item
    link.parentElement.classList.add("active");
  }
});

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
