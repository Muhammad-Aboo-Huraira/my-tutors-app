import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  getFirestore,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

import { firebaseapp } from "./firebaseConfig.js";
const auth = getAuth(firebaseapp);
const db = getFirestore(firebaseapp);

const loginForm = document.querySelector("form");
const submitButton = loginForm.querySelector('button[type="submit"]');
const loader = document.createElement("div");
loader.className = "spinner-border text-light visually-hidden";

const loaderText = document.createElement("span");
loaderText.className = "visually-hidden";

// Append the loader and text to the form
loader.appendChild(loaderText);

document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  });

function displaySuccessMessage(message, successElementId) {
  const successElement = document.getElementById(successElementId);
  successElement.textContent = message;
  successElement.style.color = "green";
  successElement.style.fontSize = "13px";
}

function displayErrorMessage(message, errorElementId) {
  const errorElement = document.getElementById(errorElementId);
  errorElement.textContent = message;
  errorElement.style.color = "red";
  errorElement.style.fontSize = "13px";
}

function clearErrorMessages() {
  const errorElements = document.querySelectorAll(".status-message");
  errorElements.forEach((element) => {
    element.textContent = "";
  });
}
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loader.classList.remove("visually-hidden");
  submitButton.innerHTML = "";
  submitButton.appendChild(loader);
  submitButton.disabled = false;

  const email = loginForm.email.value;
  const password = loginForm.password.value;
  if (password.length < 6) {
    displayErrorMessage(
      "*Password should atleast be 6 characters.",
      "credential-status"
    );
    loginForm.password.value = "";
    setTimeout(() => {
      clearErrorMessages();
    }, 2000);
    submitButton.disabled = false;
    submitButton.innerHTML = "Signup";
    return;
  }
  const isEmailRegistered = await isEmailAlreadyRegistered(email);
  if (isEmailRegistered) {
    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        displaySuccessMessage("Logged in successfully!", "credential-status");
        loginForm.reset();
        submitButton.disabled = false;
        submitButton.innerHTML = "Login";
        window.location.href = "dashboard.html";
      })
      .catch((err) => {
        console.log(err.message);
        displayErrorMessage("Invalid credentials!", "credential-status");
        loginForm.reset();
        setTimeout(() => {
          clearErrorMessages();
        }, 2000);
        submitButton.disabled = false;
        submitButton.innerHTML = "Login";
      });
    clearErrorMessages();
  } else {
    displayErrorMessage(
      "Email is not registered, want to signup?",
      "credential-status"
    );
    loginForm.reset();
    setTimeout(() => {
      clearErrorMessages();
    }, 2000);
    submitButton.disabled = false;
    submitButton.innerHTML = "Login";
  }
});

async function isEmailAlreadyRegistered(enteredEmail) {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);

    if (querySnapshot.size > 0) {
      // Loop through the documents in the "users" collection
      for (const doc of querySnapshot.docs) {
        const userEmail = doc.data().email;

        // Check if the entered email matches any user's email
        if (userEmail === enteredEmail) {
          return true; // Email is registered
        }
      }
    }

    return false; // Email is not registered
  } catch (error) {
    console.error("Error checking email registration:", error.message);
    return false; // Assume email is not registered in case of an error
  }
}
