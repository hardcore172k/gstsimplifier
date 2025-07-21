// Debug function to log with timestamp
function log(message) {
  console.log(
    `${message} at ${new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    })}`
  );
}

// Firebase initialization
const firebaseConfig = {
  apiKey: "AIzaSyBKTeUUG3c49q4NEjbPpVltAHhQikUBj8U",
  authDomain: "gst-simplifier.firebaseapp.com",
  projectId: "gst-simplifier",
  storageBucket: "gst-simplifier.appspot.com",
  messagingSenderId: "704017540712",
  appId: "1:704017540712:web:df1055d0c25f3db2e23ddd"
};

let auth, recaptchaVerifier;

try {
  const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  log('Firebase initialized successfully');

  // Emulator for local testing
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    auth.useEmulator('http://localhost:9099');
    log('Using Firebase emulator for local testing');
  }
} catch (error) {
  log('Firebase initialization failed: ' + error.message);
  alert('Firebase initialization failed: ' + error.message);
}

document.addEventListener('DOMContentLoaded', () => {
  log('Document loaded');

  // Initialize reCAPTCHA
  try {
    recaptchaVerifier = new firebase.auth.RecaptchaVerifier('signupPopup', {
      size: 'invisible',
      callback: (response) => {
        log('reCAPTCHA solved: ' + response);
      }
    });
    recaptchaVerifier.render().then(widgetId => {
      window.recaptchaWidgetId = widgetId;
      log('reCAPTCHA widget rendered: ' + widgetId);
    });
  } catch (error) {
    log('reCAPTCHA init error: ' + error.message);
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  mobileMenuBtn?.addEventListener('click', () => {
    log('Mobile menu button clicked');
    document.getElementById('mobile-menu')?.classList.toggle('hidden');
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      log(`Scrolled to ${this.getAttribute('href')}`);
    });
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
      nav.classList.toggle('bg-white/95', window.scrollY > 100);
      nav.classList.toggle('backdrop-blur-sm', window.scrollY > 100);
    }
  });

  function openSignupModal() {
    const popup = document.getElementById('signupPopup');
    if (popup) popup.style.display = 'flex';
  }

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

  // Attach modal open listeners
  [
    'get-started-btn',
    'mobile-get-started-btn',
    'start-trial-btn',
    'cta-start-trial-btn'
  ].forEach(id => {
    document.getElementById(id)?.addEventListener('click', openSignupModal);
  });

  document.querySelectorAll('.pricing-btn').forEach(button => {
    button.addEventListener('click', openSignupModal);
  });

  // Send OTP
  document.querySelector('#phoneForm button')?.addEventListener('click', () => {
    if (!auth || !recaptchaVerifier) return alert('Auth is not ready');

    const phoneInput = document.getElementById('phone');
    const phoneNumber = phoneInput.value;
    if (!/^\+\d{10,}$/.test(phoneNumber)) {
      document.getElementById('phoneError').style.display = 'block';
      return;
    }

    document.getElementById('phoneError').style.display = 'none';

    auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
      .then(confirmationResult => {
        window.confirmationResult = confirmationResult;
        document.getElementById('phoneForm').style.display = 'none';
        document.getElementById('otpForm').classList.remove('hidden');
        log('OTP sent');
      })
      .catch(error => {
        document.getElementById('phoneError').textContent = error.message;
        document.getElementById('phoneError').style.display = 'block';
        log('OTP error: ' + error.message);
      });
  });

  // Verify OTP
  document.querySelector('#otpForm button')?.addEventListener('click', () => {
    const otp = document.getElementById('otp').value;
    if (otp.length !== 6) {
      document.getElementById('otpError').style.display = 'block';
      return;
    }

    document.getElementById('otpError').style.display = 'none';

    window.confirmationResult.confirm(otp)
      .then(result => {
        log('Phone verified');
        alert('Phone number verified!');
        closeSignupModal();
      })
      .catch(error => {
        document.getElementById('otpError').textContent = error.message;
        document.getElementById('otpError').style.display = 'block';
        log('OTP verification failed: ' + error.message);
      });
  });

  // Google Sign-In
  document.querySelector('#signupPopup button:last-child')?.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(result => {
        log('Google Sign-In success');
        alert('Signed in with Google!');
        closeSignupModal();
      })
      .catch(error => {
        alert('Google Sign-In failed: ' + error.message);
        log('Google Sign-In error: ' + error.message);
      });
  });

  // Close modal
  document.querySelector('.close-btn')?.addEventListener('click', closeSignupModal);
});
