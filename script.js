// Debug function to log with timestamp
function log(message) {
  console.log(
    `${message} at ${new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    })}`
  );
}

// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add scroll effect to navbar
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 100) {
    nav.classList.add("bg-white/95", "backdrop-blur-sm");
  } else {
    nav.classList.remove("bg-white/95", "backdrop-blur-sm");
  }
});

// CTA button functionality (exclude sendOtp and submitSignup)
document.querySelectorAll("button").forEach((button) => {
  if (button.id !== "sendOtp" && button.id !== "submitSignup") {
    button.addEventListener("click", function () {
      const originalText = this.textContent;
      this.textContent = "Loading...";
      this.disabled = true;
      setTimeout(() => {
        this.textContent = originalText;
        this.disabled = false;
      }, 1500);
    });
  }
});

// Modal functions
window.openSignupModal = function () {
  document.getElementById("signupModal").classList.remove("hidden");
  window.generateCaptcha();
  log("Modal opened");
};

window.closeSignupModal = function () {
  document.getElementById("signupModal").classList.add("hidden");
  document.getElementById("signupMessage").innerText = "";
  log("Modal closed");
};

window.generateCaptcha = function () {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  document.getElementById("captchaCode").innerText = code;
  log("CAPTCHA generated");
};
