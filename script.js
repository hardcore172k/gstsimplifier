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

