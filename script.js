// Debug function to log with timestamp
function log(message) {
  console.log(
    `${message} at ${new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    })}`
  );
}

// Firebase initialization (outside DOMContentLoaded to ensure early loading)
const firebaseConfig = {
  apiKey: "AIzaSyBKTeUUG3c49q4NEjbPpVltAHhQikUBj8U",
  authDomain: "gst-simplifier.firebaseapp.com",
  projectId: "gst-simplifier",
  storageBucket: "gst-simplifier.firebasestorage.app",
  messagingSenderId: "704017540712",
  appId: "1:704017540712:web:df1055d0c25f3db2e23ddd"
};

let auth, recaptchaVerifier;

try {
  const app = firebase.initializeApp(firebaseConfig);
  auth = firebase.getAuth(app);
  log('Firebase initialized successfully');

  // Use emulator only for local testing
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    auth.useEmulator('http://localhost:9099');
    log('Using Firebase emulator for local testing');
  }

  recaptchaVerifier = new firebase.RecaptchaVerifier('signupPopup', {
    'size': 'invisible',
    'callback': (response) => {
      log('reCAPTCHA solved:', response);
    }
  }, auth);
} catch (error) {
  log('Firebase initialization failed:', error.message);
  alert('Firebase initialization failed: ' + error.message + '. Popup will still work, but authentication is disabled.');
}

document.addEventListener('DOMContentLoaded', () => {
  log('Document loaded, initializing event listeners');

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      log('Mobile menu button clicked');
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
      } else {
        log('Mobile menu element not found');
      }
    });
  } else {
    log('Mobile menu button not found');
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        log(`Scrolled to ${this.getAttribute('href')}`);
      } else {
        log(`Target ${this.getAttribute('href')} not found`);
      }
    });
  });

  // Add scroll effect to navbar
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
      if (window.scrollY > 100) {
        nav.classList.add('bg-white/95', 'backdrop-blur-sm');
      } else {
        nav.classList.remove('bg-white/95', 'backdrop-blur-sm');
      }
    } else {
      log('Navbar element not found');
    }
  });

  // Popup toggle functions
  function openSignupModal() {
    log('Opening signup modal');
    const popup = document.getElementById('signupPopup');
    if (popup) {
      popup.style.display = 'flex';
    } else {
      log('Signup popup element not found');
      alert('Error: Signup popup not found. Please check HTML.');
    }
  }

  function closeSignupModal() {
    log('Closing signup modal');
    const popup = document.getElementById('signupPopup');
    if (popup) {
      popup.style.display = 'none';
      document.getElementById('phoneForm').style.display = 'block';
      document.getElementById('otpForm').classList.add('hidden');
      document.getElementById('phoneError').style.display = 'none';
      document.getElementById('otpError').style.display = 'none';
      document.getElementById('phone').value = '';
      document.getElementById('otp').value = '';
    } else {
      log('Signup popup element not found');
    }
  }

  // Attach event listeners to buttons
  const buttons = [
    'get-started-btn',
    'mobile-get-started-btn',
    'start-trial-btn',
    'cta-start-trial-btn'
  ];
  buttons.forEach(id => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', openSignupModal);
      log(`Event listener added to ${id}`);
    } else {
      log(`Button with ID ${id} not found`);
    }
  });

  // Attach to pricing buttons
  document.querySelectorAll('.pricing-btn').forEach(button => {
    button.addEventListener('click', openSignupModal);
    log('Event listener added to pricing button');
  });

  // Attach OTP handler
  const sendOTPBtn = document.querySelector('#phoneForm button');
  if (sendOTPBtn) {
    sendOTPBtn.addEventListener('click', () => {
      log('Send OTP clicked');
      if (!auth || !recaptchaVerifier) {
        alert('Authentication is disabled due to Firebase initialization failure.');
        return;
      }

      const phoneNumber = document.getElementById('phone').value;
      if (!phoneNumber || !/^\+\d{10,}$/.test(phoneNumber)) {
        document.getElementById('phoneError').style.display = 'block';
        log('Invalid phone number:', phoneNumber);
        return;
      }
      document.getElementById('phoneError').style.display = 'none';

      firebase.signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          log('OTP sent successfully');
          window.confirmationResult = confirmationResult;
          document.getElementById('phoneForm').style.display = 'none';
          document.getElementById('otpForm').classList.remove('hidden');
        }).catch((error) => {
          document.getElementById('phoneError').style.display = 'block';
          document.getElementById('phoneError').textContent = error.message;
          log('Error sending OTP:', error.message);
        });
    });
  } else {
    log('Send OTP button not found');
  }

  // Attach OTP verification handler
  const verifyOTPBtn = document.querySelector('#otpForm button');
  if (verifyOTPBtn) {
    verifyOTPBtn.addEventListener('click', () => {
      log('Verify OTP clicked');
      if (!window.confirmationResult) {
        alert('No OTP sent. Please send OTP first.');
        return;
      }

      const otp = document.getElementById('otp').value;
      if (!otp || otp.length !== 6) {
        document.getElementById('otpError').style.display = 'block';
        log('Invalid OTP:', otp);
        return;
      }
      document.getElementById('otpError').style.display = 'none';

      window.confirmationResult.confirm(otp)
        .then((result) => {
          log('Phone number verified successfully');
          alert('Phone number verified successfully!');
          closeSignupModal();
        }).catch((error) => {
          document.getElementById('otpError').style.display = 'block';
          document.getElementById('otpError').textContent = error.message;
          log('Error verifying OTP:', error.message);
        });
    });
  } else {
    log('Verify OTP button not found');
  }

  // Attach Google Sign-In handler
  const googleSignInBtn = document.querySelector('#signupPopup button:last-child');
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', () => {
      log('Sign in with Google clicked');
      if (!auth) {
        alert('Authentication is disabled due to Firebase initialization failure.');
        return;
      }

      const provider = new firebase.GoogleAuthProvider();
      firebase.signInWithPopup(auth, provider)
        .then((result) => {
          log('Google Sign-In successful');
          alert('Signed in with Google successfully!');
          closeSignupModal();
        }).catch((error) => {
          log('Error during Google Sign-In:', error.message);
          alert('Error during Google Sign-In: ' + error.message);
        });
    });
  } else {
    log('Google Sign-In button not found');
  }

  // Attach close button handler
  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSignupModal);
    log('Event listener added to close button');
  } else {
    log('Close button not found');
  }
});
