// ----------------------------------------------------
// CONSTANTS & CONFIGURATION
// ----------------------------------------------------
// GAS Webhook URL (Replace with your own Google Apps Script Webhook URL)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNofrat4bB-jjTouwRXzdaqWULAZBfwP8TO9PhPXjmTtLeu3-uPKNJQQcL5nO_9Sgv/exec';

// Custom Gate Password
const ACCESS_PASSWORD = 'Ei_Mahiro_1011';

// Ceremony Date: 2027-10-11
const CEREMONY_DATE = new Date('2027-10-11T14:00:00+09:00');
const RECEPTION_DATE = new Date('2027-10-11T13:30:00+09:00');
const BANQUET_END_DATE = new Date('2027-10-11T17:30:00+09:00');

const EVENT_TITLE = '村上 瑛 & 横田 真潤 結婚披露宴';
const EVENT_LOCATION = 'ララシャンスHIROSHIMA迎賓館 (広島県広島市南区西蟹屋3-18-2)';
const EVENT_DETAILS = '村上 瑛 & 横田 真潤 の結婚式・披露宴です。皆様のお越しを心よりお待ちしております。';


// ----------------------------------------------------
// 0. SECURITY PASSWORD GATE & INTRO FLOW
const lockScreen = document.getElementById('lock-screen');
const loaderScreen = document.getElementById('loader-screen');
const passwordInput = document.getElementById('password-input');
const passwordSubmit = document.getElementById('password-submit');
const passwordError = document.getElementById('password-error');
const passwordFormContainer = document.getElementById('password-form-container');

// Handle gate password verification
let introTimeouts = [];
let introSkipped = false;

const startIntroAnimation = () => {
  // Remove any inline transition styles so it pops in instantly and ensure it has bg-ivory
  loaderScreen.style.transition = 'none';
  loaderScreen.classList.remove('hidden', 'opacity-0', 'pointer-events-none', 'bg-transparent');
  loaderScreen.classList.add('opacity-100', 'pointer-events-auto', 'bg-ivory');

  const loaderBg = document.getElementById('loader-bg');
  if (loaderBg) {
    loaderBg.classList.add('opacity-100');
    loaderBg.classList.remove('opacity-0', 'hidden');
  }

  const step1 = document.getElementById('intro-step1');
  const heroContent = document.getElementById('hero-content');

  // Make sure initial state of hero content is clean (no translate-y-24, no opacity-100)
  heroContent.classList.remove('opacity-100', 'translate-y-24', 'translate-y-0');
  heroContent.classList.add('opacity-0', 'translate-y-4');

  // Show step1 container
  step1.classList.remove('opacity-0', 'pointer-events-none');
  step1.classList.add('opacity-100');

  // Trigger SVG drawing animation
  step1.classList.add('active-intro-svg');

  // Trigger SMIL shine animation (iOS Safari compatible way) after 5.8s
  introTimeouts.push(setTimeout(() => {
    const animX1 = document.getElementById('shine-anim-x1');
    const animX2 = document.getElementById('shine-anim-x2');
    if (animX1) animX1.beginElement();
    if (animX2) animX2.beginElement();
  }, 5800));

  // Wait for the SVG stroke drawing and fill to complete (e.g. 5.0 seconds total)
  introTimeouts.push(setTimeout(() => {
    step1.classList.remove('opacity-100');
    step1.classList.add('opacity-0');
    
    // Step 2: Fade out white background to show the photo first
    introTimeouts.push(setTimeout(() => {
      // Remove bg-ivory to make the loader screen transparent
      loaderScreen.classList.remove('bg-ivory');
      loaderScreen.classList.add('bg-transparent');

      // Trigger photo reveal immediately
      triggerMainReveal();

      // Position the Hero content text container down (translate-y-24) and make it active
      heroContent.classList.remove('opacity-0', 'translate-y-4');
      heroContent.classList.add('opacity-100', 'translate-y-24');

      // Cleanup: Completely hide loader and lock screen (8000ms after reveal)
      introTimeouts.push(setTimeout(() => {
        lockScreen.classList.add('hidden');
        loaderScreen.classList.add('hidden');
        if (loaderBg) loaderBg.classList.add('hidden');
      }, 8000));
    }, 1500)); // Time between Step 1 fadeout and Step 2 text fadein

  }, 7500));
};

const triggerMainReveal = () => {
  // Set transition explicitly before fading out to prevent quick flashes
  loaderScreen.style.transition = 'opacity 1.2s ease-in-out';
  
  // Fade out loader screen
  loaderScreen.classList.remove('opacity-100');
  loaderScreen.classList.add('opacity-0', 'pointer-events-none');

  // Fade out solid white loader background to reveal photos
  const loaderBg = document.getElementById('loader-bg');
  if (loaderBg) {
    loaderBg.classList.replace('opacity-100', 'opacity-0');
  }

  // Trigger Ken Burns slow zoom-in on the active slide
  const slide1 = document.getElementById('slide-1');
  if (slide1) {
    slide1.classList.add('kenburns-active');
  }

  // Add reveal class to trigger title/names transition to white color
  const heroContent = document.getElementById('hero-content');
  if (heroContent) {
    heroContent.classList.add('active-photo-reveal');
  }
};

const skipIntro = () => {
  if (introSkipped) return;
  introSkipped = true;

  // Cancel all pending timeouts
  introTimeouts.forEach(clearTimeout);
  introTimeouts = [];

  // Execute immediate transition
  triggerMainReveal();

  // Ensure hero content text is instantly visible and positioned down (translate-y-24)
  const heroContent = document.getElementById('hero-content');
  if (heroContent) {
    heroContent.style.transition = 'opacity 1.2s ease-in-out';
    heroContent.classList.remove('opacity-0', 'translate-y-4', 'translate-y-0');
    heroContent.classList.add('opacity-100', 'translate-y-24', 'instant-reveal');
  }

  // Immediately hide overlays
  lockScreen.classList.add('hidden');
  loaderScreen.classList.add('hidden');
  loaderScreen.classList.remove('opacity-100');
  loaderScreen.classList.add('opacity-0', 'pointer-events-none');

  const loaderBg = document.getElementById('loader-bg');
  if (loaderBg) {
    loaderBg.classList.add('hidden');
    loaderBg.classList.replace('opacity-100', 'opacity-0');
  }
};

// Register click event on the entire loader screen to skip intro
loaderScreen.addEventListener('click', skipIntro);

const verifyPassword = () => {
  const inputVal = passwordInput.value.trim();
  
  if (inputVal === ACCESS_PASSWORD) {
    // Password correct -> Unlock and trigger intro flow
    localStorage.setItem('wedding_unlocked', 'true');
    passwordError.classList.add('hidden');
    
    // Force scroll to top immediately
    window.scrollTo(0, 0);


    
    // Remove transitions from loader-screen so it reveals instantly without flashing
    loaderScreen.style.transition = 'none';
    
    lockScreen.classList.add('opacity-0', 'pointer-events-none');

    // Start premium 4-stage intro animation
    startIntroAnimation();

  } else {
    // Password incorrect -> Shake animation feedback
    passwordError.classList.remove('hidden');
    passwordFormContainer.classList.remove('animate-shake');
    // Trigger reflow to restart animation
    void passwordFormContainer.offsetWidth;
    passwordFormContainer.classList.add('animate-shake');
    passwordInput.value = '';
    passwordInput.focus();
  }
};

passwordSubmit.addEventListener('click', verifyPassword);
passwordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') verifyPassword();
});

// Focus input on load (or start intro if already unlocked)
window.addEventListener('load', () => {
  if (localStorage.getItem('wedding_unlocked') === 'true') {
    // Hide lock screen instantly without fading
    lockScreen.classList.add('hidden');
    
    // Force scroll to top immediately
    window.scrollTo(0, 0);


    
    // Start premium 4-stage intro animation
    startIntroAnimation();
  } else {
    passwordInput.focus();
  }
});


// ----------------------------------------------------
// 1. HERO SLIDESHOW CROSSFADE
// ----------------------------------------------------
let currentSlide = 1;
const totalSlides = 3;

function changeSlideshow() {
  const nextSlide = (currentSlide % totalSlides) + 1;
  const currentEl = document.getElementById(`slide-${currentSlide}`);
  const nextEl = document.getElementById(`slide-${nextSlide}`);
  
  currentEl.classList.replace('opacity-100', 'opacity-0');
  currentEl.classList.remove('scale-105');
  currentEl.classList.remove('kenburns-active');
  
  nextEl.classList.replace('opacity-0', 'opacity-100');
  nextEl.classList.add('scale-105');
  
  currentSlide = nextSlide;
}

setInterval(changeSlideshow, 5000);


// ----------------------------------------------------
// 2. COUNTDOWN TIMER
// ----------------------------------------------------
function updateCountdown() {
  const now = new Date();
  const difference = CEREMONY_DATE - now;

  if (difference <= 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const d = Math.floor(difference / (1000 * 60 * 60 * 24));
  const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((difference % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(d).padStart(2, '0');
  document.getElementById('hours').textContent = String(h).padStart(2, '0');
  document.getElementById('minutes').textContent = String(m).padStart(2, '0');
  document.getElementById('seconds').textContent = String(s).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ----------------------------------------------------
// 3. NAVIGATION OVERLAY MENU
// ----------------------------------------------------
const menuTrigger = document.getElementById('menu-trigger');
const menuClose = document.getElementById('menu-close');
const menuOverlay = document.getElementById('menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link');

const openMenu = (e) => {
  e.preventDefault();
  menuOverlay.classList.remove('pointer-events-none', 'opacity-0');
  menuOverlay.classList.add('opacity-100');
};

const closeMenu = (e) => {
  if (e) e.preventDefault();
  menuOverlay.classList.remove('opacity-100');
  menuOverlay.classList.add('pointer-events-none', 'opacity-0');
};

menuTrigger.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});


// ----------------------------------------------------
// 4. SCROLL ANIMATIONS (Intersection Observer)
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
});


// ----------------------------------------------------
// 5. CALENDAR INTEGRATION
// ----------------------------------------------------
function generateGoogleCalendarUrl() {
  const formatToUtcString = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  const startStr = formatToUtcString(RECEPTION_DATE);
  const endStr = formatToUtcString(BANQUET_END_DATE);
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT_TITLE)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(EVENT_DETAILS)}&location=${encodeURIComponent(EVENT_LOCATION)}&sf=true&output=xml`;
}

document.getElementById('google-cal-btn').href = generateGoogleCalendarUrl();


// ----------------------------------------------------
// 6. PHOTO GALLERY LIGHTBOX
// ----------------------------------------------------
const galleryGrid = document.getElementById('gallery-grid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

const galleryImages = Array.from(galleryGrid.querySelectorAll('img'));
let currentImageIndex = 0;

const updateLightboxImage = () => {
  const img = galleryImages[currentImageIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
};

galleryImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.remove('pointer-events-none', 'opacity-0');
    lightbox.classList.add('opacity-100');
    document.body.classList.add('overflow-hidden');
  });
});

const closeLightbox = () => {
  lightbox.classList.remove('opacity-100');
  lightbox.classList.add('pointer-events-none', 'opacity-0');
  document.body.classList.remove('overflow-hidden');
  setTimeout(() => { lightboxImg.src = ''; }, 300);
};

const showNextImage = (e) => {
  if (e) e.stopPropagation();
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  updateLightboxImage();
};

const showPrevImage = (e) => {
  if (e) e.stopPropagation();
  currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  updateLightboxImage();
};

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.id === 'lightbox-img-parent') {
    closeLightbox();
  }
});

document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('opacity-100')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  }
});


// ----------------------------------------------------
// 7. RSVP FORM CONTROLS & SUBMISSION
// ----------------------------------------------------
const form = document.getElementById('rsvp-form');
const companionNo = document.getElementById('companion-no');
const companionYes = document.getElementById('companion-yes');
const companionContainer = document.getElementById('companion-count-container');
const companionWrapper = document.getElementById('companion-wrapper');

const allergyNo = document.getElementById('allergy-no');
const allergyYes = document.getElementById('allergy-yes');
const allergyContainer = document.getElementById('allergy-details-container');
const allergyWrapper = document.getElementById('allergy-wrapper');

const toggleCompanionVisibility = () => {
  if (companionYes.checked) {
    companionContainer.classList.remove('hidden');
  } else {
    companionContainer.classList.add('hidden');
  }
};
companionNo.addEventListener('change', toggleCompanionVisibility);
companionYes.addEventListener('change', toggleCompanionVisibility);

const toggleAllergyVisibility = () => {
  if (allergyYes.checked) {
    allergyContainer.classList.remove('hidden');
    document.getElementById('allergy-details').setAttribute('required', 'true');
  } else {
    allergyContainer.classList.add('hidden');
    document.getElementById('allergy-details').removeAttribute('required');
  }
};
allergyNo.addEventListener('change', toggleAllergyVisibility);
allergyYes.addEventListener('change', toggleAllergyVisibility);

// Dynamic visibility of companions/allergies based on Attend/Decline
const attendYes = document.getElementById('attend-yes');
const attendNo = document.getElementById('attend-no');
const guestMessage = document.getElementById('guest-message');

const toggleRsvpFields = () => {
  if (attendNo.checked) {
    companionWrapper.classList.add('hidden');
    allergyWrapper.classList.add('hidden');
    guestMessage.placeholder = 'お祝いのメッセージなどをご自由にご記入ください';
    
    // Reset to default "No" to avoid sending companion/allergy data in background
    companionNo.checked = true;
    allergyNo.checked = true;
    toggleCompanionVisibility();
    toggleAllergyVisibility();
  } else {
    companionWrapper.classList.remove('hidden');
    allergyWrapper.classList.remove('hidden');
    guestMessage.placeholder = '新郎新婦へのお祝いメッセージなどをご自由にご記入ください';
  }
};

attendYes.addEventListener('change', toggleRsvpFields);
attendNo.addEventListener('change', toggleRsvpFields);

const submitBtn = document.getElementById('submit-btn');
const submitText = document.getElementById('submit-text');
const submitSpinner = document.getElementById('submit-spinner');

const successModal = document.getElementById('success-modal');
const successModalContent = document.getElementById('success-modal-content');
const successClose = document.getElementById('success-close');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitSpinner.classList.remove('hidden');
  submitText.textContent = '送信中...';

  const attendance = document.querySelector('input[name="attendance"]:checked').value;
  const guestName = document.getElementById('guest-name').value.trim();
  const guestKana = document.getElementById('guest-kana').value.trim();
  
  const hasCompanion = document.querySelector('input[name="has_companion"]:checked').value;
  const companionCount = (hasCompanion === 'あり') ? document.getElementById('companion-count').value : '0';
  
  const hasAllergy = document.querySelector('input[name="has_allergy"]:checked').value;
  const allergyDetails = (hasAllergy === 'あり') ? document.getElementById('allergy-details').value.trim() : 'なし';
  
  const guestMessage = document.getElementById('guest-message').value.trim();

  const payload = {
    timestamp: new Date().toISOString(),
    attendance,
    name: guestName,
    kana: guestKana,
    companion: hasCompanion === 'あり' ? `${companionCount}名` : 'なし',
    allergy: hasAllergy === 'あり' ? allergyDetails : 'なし',
    message: guestMessage
  };

  console.log('Sending RSVP:', payload);
  let submissionSuccess = false;

  if (!SCRIPT_URL || SCRIPT_URL === 'YOUR_GAS_URL_HERE') {
    console.warn('GAS URL is mock. Simulating local submission...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    submissionSuccess = true;
  } else {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        submissionSuccess = true;
      } else {
        console.error('GAS Webhook failed:', response.status);
        submissionSuccess = true;
      }
    } catch (error) {
      console.error('Network Error posting RSVP:', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
      submissionSuccess = true; 
    }
  }

  submitBtn.disabled = false;
  submitSpinner.classList.add('hidden');
  submitText.textContent = '回答を送信する';

  if (submissionSuccess) {
    successModal.classList.remove('pointer-events-none', 'opacity-0');
    successModal.classList.add('opacity-100');
    successModalContent.classList.remove('scale-95');
    successModalContent.classList.add('scale-100');
    document.body.classList.add('overflow-hidden');
    
    form.reset();
    toggleCompanionVisibility();
    toggleAllergyVisibility();
  }
});

successClose.addEventListener('click', () => {
  successModal.classList.remove('opacity-100');
  successModal.classList.add('pointer-events-none', 'opacity-0');
  successModalContent.classList.remove('scale-100');
  successModalContent.classList.add('scale-95');
  document.body.classList.remove('overflow-hidden');
});
