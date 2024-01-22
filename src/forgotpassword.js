import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
import {
  getAuth,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

import { firebaseapp } from "./firebaseConfig.js";
const auth = getAuth(firebaseapp);
const db = getFirestore(firebaseapp);

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
clearErrorMessages();
const loginForm = document.querySelector("form");
const submitButton = loginForm.querySelector('button[type="submit"]');

//Loader
const loader = document.createElement("div");
loader.className = "spinner-border text-light visually-hidden";
const loaderText = document.createElement("span");
loaderText.className = "visually-hidden";
loader.appendChild(loaderText);

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  const resetButton = document.querySelector("button");
  const emailInput = document.getElementById("email");

  resetButton.addEventListener("click", async (e) => {
    e.preventDefault();

    loader.classList.remove("visually-hidden");
    submitButton.innerHTML = "";
    submitButton.appendChild(loader);
    submitButton.disabled = false;

    const enteredEmail = emailInput.value.trim();

    if (!enteredEmail) {
      displayErrorMessage("Please enter email!", "credential-status");
      setTimeout(() => {
        clearErrorMessages();
      }, 2000);
      submitButton.disabled = false;
      submitButton.innerHTML = "Reset Password";
      return;
    }
    // Check if the email exists in the "users" collection
    const isEmailRegistered = await isEmailAlreadyRegistered(enteredEmail);

    if (isEmailRegistered) {
      // Email is registered, send the password reset email
      sendPasswordResetEmail(auth, enteredEmail)
        .then(() => {
          displaySuccessMessage(
            "Password reset email sent, Check your inbox",
            "credential-status"
          );
          setTimeout(() => {
            clearErrorMessages();
          }, 2000);
          submitButton.disabled = false;
          submitButton.innerHTML = "Reset Password";
          emailInput.value = "";
        })
        .catch((error) => {
          displayErrorMessage(
            "Error sending password reset email!",
            "credential-status"
          );
          setTimeout(() => {
            clearErrorMessages();
          }, 2000);
        });
    } else {
      // Email is not registered
      displayErrorMessage(
        "This email is not registered. Please enter a valid email!",
        "credential-status"
      );
      setTimeout(() => {
        clearErrorMessages();
      }, 2000);
      submitButton.disabled = false;
      submitButton.innerHTML = "Reset Password";
      emailInput.value = "";
    }
  });
});

// Function to check if the email is already registered in the "users" collection
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
