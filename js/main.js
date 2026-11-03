/**
 * STACKLY — Construction & Architectural Engineering
 * Core Application JavaScript (Indian Edition)
 * Includes Hartwell & Kessler Webflow style smooth animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveLinks();
  initScrollAnimations();
  initHeaderScroll();
  initAuthRoleSwitcher();
  initLoginForm();
  initSignupForm();
  initDashboards();
  initUnwantedRedirects();
});

/* ==========================================================================
   1. HARTWELL & KESSLER STYLE SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  // Elements with .reveal or key section elements
  const revealElements = document.querySelectorAll(
    '.reveal, .feature-card, .project-card, .process-step, .testimonial-card, .stat-card-dash, .section-header'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          
          // Animate progress bar fill if inside this target
          const progressBar = entry.target.querySelector('.progress-bar-fill');
          if (progressBar && progressBar.dataset.targetWidth) {
            progressBar.style.width = progressBar.dataset.targetWidth;
          }

          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, index) => {
      el.classList.add('reveal');
      // Apply stagger class if inside cards grid
      const parentGrid = el.closest('.cards-grid-3, .cards-grid-2, .cards-grid-4, .process-track');
      if (parentGrid) {
        const siblingIndex = Array.from(el.parentNode.children).indexOf(el);
        const staggerNum = (siblingIndex % 5) + 1;
        el.classList.add(`stagger-${staggerNum}`);
      }
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-visible'));
  }
}

/* ==========================================================================
   2. HEADER SCROLL SHADOW & ELEVATION
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   3. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navDrawer = document.querySelector('.mobile-nav-drawer');

  if (toggleBtn && navDrawer) {
    toggleBtn.addEventListener('click', () => {
      navDrawer.classList.toggle('open');
      const isOpen = navDrawer.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close drawer when clicking a link inside
    navDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navDrawer.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   4. ACTIVE NAV LINK HIGHLIGHTING
   ========================================================================== */
function initActiveLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   5. AUTH ROLE SWITCHER (CLIENT vs ADMIN)
   ========================================================================== */
function initAuthRoleSwitcher() {
  const roleTabs = document.querySelectorAll('.role-tab');
  const roleInput = document.getElementById('selected-role');
  const roleLabel = document.getElementById('role-indicator-text');
  const submitBtn = document.getElementById('login-submit-btn');

  if (roleTabs.length > 0) {
    roleTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        roleTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const role = tab.getAttribute('data-role'); // 'client' or 'admin'
        if (roleInput) roleInput.value = role;

        if (roleLabel) {
          roleLabel.textContent = role === 'admin' ? 'Admin Superintendent Authentication' : 'Client Project Portal';
        }

        if (submitBtn) {
          submitBtn.textContent = role === 'admin' ? 'Sign In as Admin' : 'Sign In as Client';
        }
      });
    });
  }
}

/* ==========================================================================
   6. USERNAME EXTRACTION & LOGIN FORM LOGIC
   ========================================================================== */
function extractUsernameFromEmail(email) {
  if (!email || !email.includes('@')) {
    return 'Stackly Member';
  }

  // Get portion before @
  const prefix = email.split('@')[0];
  // Split on dots, underscores, dashes, or digits
  const parts = prefix.split(/[._\-\d]+/).filter(Boolean);

  if (parts.length === 0) {
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }

  // Capitalize each part (e.g., 'kavita.singh' -> 'Kavita Singh')
  return parts
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('user-email');
    const roleInput = document.getElementById('selected-role');

    const email = emailInput ? emailInput.value.trim() : '';
    const role = roleInput ? roleInput.value : 'client';

    if (!email) {
      alert('Please enter your email or Gmail address.');
      return;
    }

    // Extract username from Gmail/email provided
    const extractedName = extractUsernameFromEmail(email);

    // Save to localStorage
    localStorage.setItem('stackly_username', extractedName);
    localStorage.setItem('stackly_email', email);
    localStorage.setItem('stackly_role', role);
    localStorage.setItem('stackly_logged_in', 'true');

    // Route to corresponding dashboard
    if (role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'client-dashboard.html';
    }
  });
}

function initSignupForm() {
  const signupForm = document.getElementById('signup-form');
  if (!signupForm) return;

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('signup-email');
    const nameInput = document.getElementById('signup-name');
    const roleSelect = document.getElementById('signup-role');

    const email = emailInput ? emailInput.value.trim() : '';
    const rawName = nameInput ? nameInput.value.trim() : '';
    const role = roleSelect ? roleSelect.value : 'client';

    if (!email) {
      alert('Please enter your email address.');
      return;
    }

    // Priority: entered name or username extracted from Gmail
    const finalName = rawName || extractUsernameFromEmail(email);

    localStorage.setItem('stackly_username', finalName);
    localStorage.setItem('stackly_email', email);
    localStorage.setItem('stackly_role', role);
    localStorage.setItem('stackly_logged_in', 'true');

    alert(`Account created successfully for ${finalName}! Redirecting to dashboard.`);
    
    if (role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'client-dashboard.html';
    }
  });
}

/* ==========================================================================
   7. DASHBOARDS POPULATION & SESSION HANDLING
   ========================================================================== */
function initDashboards() {
  const isClientDash = window.location.pathname.includes('client-dashboard.html');
  const isAdminDash = window.location.pathname.includes('admin-dashboard.html');

  if (!isClientDash && !isAdminDash) return;

  // Retrieve stored user data
  let storedName = localStorage.getItem('stackly_username');
  let storedEmail = localStorage.getItem('stackly_email');
  let storedRole = localStorage.getItem('stackly_role');

  // Fallback Indian defaults if accessed directly
  if (!storedName) {
    storedName = isClientDash ? 'Kavita Singhania' : 'Rajesh Varma';
    storedEmail = isClientDash ? 'kavita.singhania@gmail.com' : 'rajesh.admin@gmail.com';
    storedRole = isClientDash ? 'client' : 'admin';
  }

  // Populate UI
  document.querySelectorAll('.user-display-name').forEach(el => {
    el.textContent = storedName;
  });

  document.querySelectorAll('.user-display-email').forEach(el => {
    el.textContent = storedEmail;
  });

  document.querySelectorAll('.user-display-role').forEach(el => {
    el.textContent = storedRole.toUpperCase();
  });

  // Logout button handler
  const logoutBtns = document.querySelectorAll('.btn-logout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('stackly_logged_in');
      window.location.href = 'login.html';
    });
  });
}

/* ==========================================================================
   8. REDIRECT ALL UNWANTED LINKS, BUTTONS & FORMS TO 404 PAGE
   ========================================================================== */
function initUnwantedRedirects() {
  // 1. Unwanted links
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#' || href === 'javascript:void(0)' || link.classList.contains('redirect-404')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    }
  });

  // 2. Unwanted buttons
  document.querySelectorAll('button').forEach(btn => {
    if (
      btn.classList.contains('mobile-toggle') ||
      btn.classList.contains('role-tab') ||
      btn.id === 'login-submit-btn' ||
      btn.id === 'signup-submit-btn' ||
      btn.classList.contains('btn-logout')
    ) {
      return;
    }

    if (btn.classList.contains('btn-unwanted') || btn.getAttribute('data-action') === 'unwanted') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    }
  });

  // 3. All forms EXCEPT login & signup redirect to 404 page
  document.querySelectorAll('form').forEach(form => {
    if (form.id === 'login-form' || form.id === 'signup-form') {
      return;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });
}
