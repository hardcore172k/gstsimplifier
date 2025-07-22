// Debug function to log with timestamp
function log(message) {
  console.log(
    `${message} at ${new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    })}`
  );
}

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKTeUUG3c49q4NEjbPpVltAHhQikUBj8U",
  authDomain: "gst-simplifier.firebaseapp.com",
  projectId: "gst-simplifier",
  storageBucket: "gst-simplifier.appspot.com",
  messagingSenderId: "704017540712",
  appId: "1:704017540712:web:df1055d0c25f3db2e23ddd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let recaptchaVerifier;
document.addEventListener('DOMContentLoaded', () => {
  log('Document loaded, initializing event listeners');

  // Initialize reCAPTCHA
  recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',
    callback: (response) => {
      log('reCAPTCHA solved:', response);
    }
  });
  recaptchaVerifier.render();

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) mobileMenu.classList.toggle('hidden');
    });
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Scroll effect for navbar
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
      if (window.scrollY > 100) {
        nav.classList.add('bg-white/95', 'backdrop-blur-sm');
      } else {
        nav.classList.remove('bg-white/95', 'backdrop-blur-sm');
      }
    }
  });

  // Open signup popup
  function openSignupModal() {
    const popup = document.getElementById('signupPopup');
    if (popup) popup.style.display = 'flex';
  }

  // Close signup popup
  function closeSignupModal() {
    const popup = document.getElementById('signupPopup');
    if (popup) {
      popup.style.display = 'none';
      document.getElementById('phoneForm').style.display = 'block';
      document.getElementById('otpForm').classList.add('hidden');
      document.getElementById('phoneError').style.display = 'none';
      document.getElementById('otpError').style.display = 'none';
      document.getElementById('phone').value = '';
      document.getElementById('otp').value = '';
    }
  }

  // Button listeners
  ['get-started-btn', 'mobile-get-started-btn', 'start-trial-btn', 'cta-start-trial-btn'].forEach(id => {
    const button = document.getElementById(id);
    if (button) button.addEventListener('click', openSignupModal);
  });

  document.querySelectorAll('.pricing-btn').forEach(btn => {
    btn.addEventListener('click', openSignupModal);
  });

  const sendOTPBtn = document.querySelector('#phoneForm button');
  if (sendOTPBtn) {
    sendOTPBtn.addEventListener('click', () => {
      const phoneNumber = document.getElementById('phone').value;
      if (!phoneNumber || !/^[+]\d{10,}$/.test(phoneNumber)) {
        document.getElementById('phoneError').style.display = 'block';
        return;
      }
      document.getElementById('phoneError').style.display = 'none';

      firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          document.getElementById('phoneForm').style.display = 'none';
          document.getElementById('otpForm').classList.remove('hidden');
        }).catch((error) => {
          document.getElementById('phoneError').style.display = 'block';
          document.getElementById('phoneError').textContent = error.message;
        });
    });
  }

  const verifyOTPBtn = document.querySelector('#otpForm button');
  if (verifyOTPBtn) {
    verifyOTPBtn.addEventListener('click', () => {
      const otp = document.getElementById('otp').value;
      if (!otp || otp.length !== 6) {
        document.getElementById('otpError').style.display = 'block';
        return;
      }
      document.getElementById('otpError').style.display = 'none';

      window.confirmationResult.confirm(otp)
        .then(result => {
          alert('Phone number verified successfully!');
          closeSignupModal();
        })
        .catch(error => {
          document.getElementById('otpError').style.display = 'block';
          document.getElementById('otpError').textContent = error.message;
        });
    });
  }

  const googleSignInBtn = document.querySelector('#signupPopup button:last-child');
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .then(result => {
          alert('Signed in with Google successfully!');
          closeSignupModal();
        })
        .catch(error => {
          alert('Error during Google Sign-In: ' + error.message);
        });
    });
  }

  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeSignupModal);
});
