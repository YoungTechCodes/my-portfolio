"use strict";
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );

  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    menuToggle.textContent = "☰";
  });
});

document.getElementById("year").textContent =
  new Date().getFullYear();

const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const buttonText = document.getElementById("buttonText");
const formStatus = document.getElementById("formStatus");

function showStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = "form-status " + type;
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  showStatus("", "");

  if (!contactForm.reportValidity()) {
    return;
  }

  if (contactForm.elements["_honey"].value !== "") {
    showStatus("Your message could not be submitted.", "error");
    return;
  }


  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name.length < 2 || !email || message.length < 10) {
    showStatus(
      "Please enter a valid name, email address, and message of at least 10 characters.",
      "error"
    );
    return;
  }

  submitBtn.disabled = true;
  buttonText.textContent = "Sending...";

  try {
    const formData = new FormData(contactForm);

    const response = await fetch(contactForm.action, {
      method: "POST",
      headers: {
        Accept: "application/json"
      },
      body: formData
    });

    // Read the response from FormSubmit.
    const result = await response.json();

    if (!response.ok || result.success === false) {
      throw new Error(
        result.message || "The email service rejected the submission."
      );
    }

    showStatus(
      "Your message was accepted by the email service! Check your inbox for the enquiry.",
      "success"
    );

    contactForm.reset();

  } catch (error) {
    console.error("Contact form error:", error);

    showStatus(
      "We couldn't confirm delivery. Check your internet connection and try again. If the problem continues, check your FormSubmit activation.",
      "error"
    );
  } finally {
    submitBtn.disabled = false;
    buttonText.textContent = "Send Message ↗";
  }
});