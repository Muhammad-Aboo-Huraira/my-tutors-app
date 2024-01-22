import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  getFirestore,
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

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
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((element) => {
    element.textContent = "";
  });
}
document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  });

const signUpForm = document.querySelector("form");
const submitButton = signUpForm.querySelector('button[type="submit"]');

//Loader
const loader = document.createElement("div");
loader.className = "spinner-border text-light visually-hidden";
const loaderText = document.createElement("span");
loaderText.className = "visually-hidden";
loader.appendChild(loaderText);

signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loader.classList.remove("visually-hidden");
  submitButton.innerHTML = "";
  submitButton.appendChild(loader);
  submitButton.disabled = false;

  const username = document.querySelector(".username").value;
  const email = document.querySelector(".email").value;
  const emailInput = document.querySelector(".email");
  const password = document.querySelector(".password").value;
  const passwordInput = document.querySelector(".password");
  const role = document.querySelector(".form-select").value;

  if (password.length < 6) {
    displayErrorMessage(
      "*Password should atleast be 6 characters.",
      "password-error"
    );
    passwordInput.value = "";
    setTimeout(() => {
      clearErrorMessages();
    }, 2000);
    submitButton.disabled = false;
    submitButton.innerHTML = "Signup";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await addDoc(collection(db, "users"), {
      user_id: user.uid,
      username: username,
      email: email,
      role: role,
    });

    submitButton.disabled = false;
    submitButton.innerHTML = "Signup";
    displaySuccessMessage("User signed up successfully!", "signup-success");
    signUpForm.reset();
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      displayErrorMessage("*Email address already in use.", "password-error");
      emailInput.value = "";
      passwordInput.value = "";
      setTimeout(() => {
        clearErrorMessages();
      }, 2000);
      submitButton.disabled = false;
      submitButton.innerHTML = "Signup";
      return;
    }
    console.error("Error creating user:", error.message);
    displayErrorMessage(error.message, "password-error");
    setTimeout(() => {
      clearErrorMessages();
    }, 2000);
    submitButton.disabled = false;
    submitButton.innerHTML = "Signup";
  }
});
