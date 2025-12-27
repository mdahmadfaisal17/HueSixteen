/* ============== UTIL: SCROLL LOCK (START) ============== */
function lockScroll(lock){
  document.documentElement.style.overflow = lock ? 'hidden' : '';
  document.body.style.overflow = lock ? 'hidden' : '';
}
/* ============== UTIL: SCROLL LOCK (END) */

/* ============== CTA RIPPLE ORIGIN (START) ============== */
(() => {
  const btns = document.querySelectorAll('.hiremebtn');
  btns.forEach(btn => {
    const setPos = (e) => {
      const r = btn.getBoundingClientRect();
      const p = e.touches?.[0] || e;
      btn.style.setProperty('--x', `${p.clientX - r.left}px`);
      btn.style.setProperty('--y', `${p.clientY - r.top}px`);
    };
    btn.addEventListener('mouseenter', setPos, {passive:true});
    btn.addEventListener('mousemove', setPos, {passive:true});
    btn.addEventListener('touchstart', setPos, {passive:true});
  });
})();
/* ============== CTA RIPPLE ORIGIN (END) */


/* ============== LEAD POPUP BAR (UPDATED CLEAN VERSION) ============== */
(() => {
  const modal    = document.getElementById('leadModal');
  const overlay  = document.getElementById('leadOverlay');
  const btnClose = document.getElementById('leadClose');
  const form     = document.getElementById('leadForm');
  const toast    = document.getElementById('leadToast');
  const nameInp  = document.getElementById('leadName');

  if (!modal || !overlay || !btnClose || !form || !toast) return;

  /* Required fields */
  const contactField = document.getElementById('leadContact');
  const descField    = document.getElementById('leadDesc');

  if (contactField) contactField.required = true;
  if (descField) descField.required = true;

  const openers = document.querySelectorAll('.open-lead, #ctaTalk, #drawerCta');
  let open = false;
  let toastTimer = null;

  /* ------------ Modal Controls ------------ */
  const showModal = () => {
    modal.classList.add('is-open');
    overlay.hidden = false;
    overlay.style.opacity = '1';
    modal.setAttribute('aria-hidden', 'false');
    lockScroll(true);
    open = true;
    form.reset();
    const customWrap = document.getElementById('customBudgetWrap');
    if (customWrap) customWrap.hidden = true;
    setTimeout(() => nameInp?.focus(), 160);
    clearAllErrors();
  };

  const hideModal = () => {
    modal.classList.remove('is-open');
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.hidden = true; }, 180);
    modal.setAttribute('aria-hidden', 'true');
    lockScroll(false);
    open = false;
  };

  /* ------------ Toast ------------ */
  const showToast = (message = '') => {
    if (toastTimer) clearTimeout(toastTimer);
    if (message) toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('is-open'));
    toastTimer = setTimeout(hideToast, 2500);
  };

  const hideToast = () => {
    toast.classList.remove('is-open');
    setTimeout(() => { toast.hidden = true; }, 220);
  };

  /* Openers & Closing */
  openers.forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    showModal();
  }));

  btnClose.addEventListener('click', hideModal);
  overlay.addEventListener('click', hideModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) hideModal(); });

  /* ------------ Validation Helpers ------------ */
  function createErrorEl(msg){
    const el = document.createElement('small');
    el.className = 'error-text';
    el.textContent = msg;
    return el;
  }

  function clearErrorForField(field){
    field.classList.remove('invalid');
    const parent = field.closest('.field');
    if (!parent) return;
    const existing = parent.querySelector('.error-text');
    if (existing) existing.remove();
  }

  function setErrorForField(field, msg){
    field.classList.add('invalid');
    const parent = field.closest('.field');
    if (!parent) return;
    if (!parent.querySelector('.error-text')){
      parent.appendChild(createErrorEl(msg));
    }
  }

  function clearAllErrors(){
    const invalids = form.querySelectorAll('.invalid');
    invalids.forEach(f => clearErrorForField(f));
    const allErr = form.querySelectorAll('.error-text');
    allErr.forEach(e => e.remove());
  }

  function isVisible(el){
    if (!el) return false;
    if (el.hidden) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    return true;
  }

  /* Live validation */
  const watchFields = Array.from(form.querySelectorAll('input, textarea, select'));
  watchFields.forEach(f => {
    const ev = (f.tagName.toLowerCase() === 'select') ? 'change' : 'input';
    f.addEventListener(ev, () => {
      if (f.required){
        if (f.type === 'checkbox' || f.type === 'radio') {
          if (f.checked) clearErrorForField(f);
        } else if (f.value && f.value.trim() !== '') {
          clearErrorForField(f);
        }
      } else {
        clearErrorForField(f);
      }
    });
  });

  /* ------------ FINAL EMAILJS SUBMIT HANDLER ------------ */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearAllErrors();

    /* Manual validation check */
    const requiredFields = Array.from(form.querySelectorAll("[required]"));
    let hasError = false;

    requiredFields.forEach(field => {
      if (isVisible(field)) {
        if (!field.value || field.value.trim() === "") {
          setErrorForField(field, "This field is required.");
          hasError = true;
        }
      }
    });

    /* Custom budget validation */
    const budgetVal = document.getElementById("leadBudget")?.value;
    const customAmt = document.getElementById("customBudget")?.value.trim();

    if (budgetVal === "custom" && (!customAmt || Number(customAmt) <= 0)) {
      const customField = document.getElementById("customBudget");
      setErrorForField(customField, "Enter a valid custom amount.");
      hasError = true;
    }

    if (hasError) {
      const firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* Disable button */
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");

    /* EmailJS send */
    emailjs.sendForm(
      "service_8iy7qp2",
      "template_vc1ixke",
      form
    )
    .then(() => {
        showToast("Your message has been sent successfully!");
        form.reset();
        setTimeout(hideModal, 700);
    })
    .catch((error) => {
        console.error("EmailJS Error:", error);
        alert("Failed to send. Please try again.");
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
    });
  });
})();

/* ===== Budget dropdown functionality ===== */
(() => {
  const budgetSel = document.getElementById('leadBudget');
  const wrap = document.getElementById('customBudgetWrap');
  const amt = document.getElementById('customBudget');
  if (!budgetSel || !wrap || !amt) return;

  const toggle = () => {
    if (budgetSel.value === 'custom') {
      wrap.hidden = false;
      setTimeout(() => amt.focus(), 50);
      amt.required = true;
    } else {
      wrap.hidden = true;
      amt.value = '';
      amt.required = false;
      amt.classList.remove('invalid');
      const parent = amt.closest('.field');
      if (parent) {
        const existing = parent.querySelector('.error-text');
        if (existing) existing.remove();
      }
    }
  };

  budgetSel.addEventListener('change', toggle);
  toggle();
})();


/* ============== LEAD POPUP BAR (END) ============== */










/* ============== RIGHT INFO DRAWER (START) ============== */
(() => {
  const toggleBtn = document.getElementById('infoToggle');
  const panel     = document.getElementById('sitePanel');
  const closeBtn  = document.getElementById('panelClose');
  const overlay   = document.getElementById('panelOverlay');
  if (!toggleBtn || !panel || !closeBtn || !overlay) return;

  let open = false;
  const show = () => {
    panel.classList.add('is-open');
    overlay.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    lockScroll(true);
    open = true;
  };
  const hide = () => {
    panel.classList.remove('is-open');
    overlay.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    lockScroll(false);
    open = false;
  };

  toggleBtn.addEventListener('click', (e) => { e.preventDefault(); open ? hide() : show(); });
  closeBtn.addEventListener('click', hide);
  overlay.addEventListener('click', hide);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) hide(); });
})();
/* ============== RIGHT INFO DRAWER (END) ============== */

/* ============== LEFT MENU DRAWER (MOBILE) (START) ============== */
(() => {
  const toggleBtn = document.getElementById('menuToggle');
  const drawer    = document.getElementById('mobileMenu');
  const closeBtn  = document.getElementById('drawerClose');
  const overlay   = document.getElementById('menuOverlay');
  if (!toggleBtn || !drawer || !closeBtn || !overlay) return;

  let open = false;
  const show = () => {
    drawer.classList.add('is-open');
    overlay.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    lockScroll(true);
    open = true;
  };
  const hide = () => {
    drawer.classList.remove('is-open');
    overlay.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    lockScroll(false);
    open = false;
  };

  toggleBtn.addEventListener('click', (e) => { e.preventDefault(); open ? hide() : show(); });
  closeBtn.addEventListener('click', hide);
  overlay.addEventListener('click', hide);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) hide(); });
})();
/* ============== LEFT MENU DRAWER (MOBILE) (END) ============== */








/* ============ BRAND MARQUEE — SCRIPT (START) ============ */
(function(){
  const rail = document.getElementById('bmRail');
  if(!rail) return;

  // Find the first track
  const firstTrack = rail.querySelector('.bm-track');
  if(!firstTrack || !firstTrack.children.length) return;

  // Clone the first track to create a seamless loop
  const clone = firstTrack.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  rail.appendChild(clone);

  // Start animation only after DOM paints with the clone
  requestAnimationFrame(() => {
    rail.classList.add('is-animating');
  });

  // Ensure visual gap equals the CSS var gap (defensive)
  rail.style.gap = 'var(--bm-gap)';
})();
/* ============ BRAND MARQUEE — SCRIPT (END) ============ */







/* ================= KPI — SCRIPT (START) ================= */
/* Count-up with reduced-motion support and once-only trigger */
(() => {
  const els = document.querySelectorAll('.count');
  if (!els.length) return;

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = (el) => {
    const to = Number(el.dataset.to || 0);

    // Respect reduced motion: set value immediately
    if (prefersReduce) {
      el.textContent = String(to);
      return;
    }

    const dur = 1200; // ms
    const start = performance.now();

    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(eased * to);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
})();
/* ================= KPI — SCRIPT (END) ================= */








(() => {
  const btns = document.querySelectorAll('.srvbttm-btn');
  btns.forEach(btn => {
    const setPos = (e) => {
      const r = btn.getBoundingClientRect();
      const p = e.touches?.[0] || e;
      btn.style.setProperty('--x', `${p.clientX - r.left}px`);
      btn.style.setProperty('--y', `${p.clientY - r.top}px`);
    };
    btn.addEventListener('mouseenter', setPos, { passive: true });
    btn.addEventListener('mousemove', setPos, { passive: true });
    btn.addEventListener('touchstart', setPos, { passive: true });
  });
})();





























(function () {
  const viewport = document.querySelector(".clntrvw-viewport");
  const track = document.querySelector(".clntrvwscsn");
  const cards = Array.from(document.querySelectorAll(".clntrvw-card"));
  const pills = Array.from(document.querySelectorAll(".clntrvw-crdpill-line"));

  // 880px এবং নিচে ১টা কার্ড
  let VISIBLE = window.innerWidth <= 880 ? 1 : 2;
  const SLIDE_MS = 1400;
  const AUTOPLAY_MS = 4000;

  let index = 0;
  let stepPx = 0;
  let maxIndex = Math.max(0, cards.length - VISIBLE);
  let isAnimating = false;
  let autoTimer = null;

  function getGap() {
    const cs = getComputedStyle(track);
    const g = parseFloat(cs.gap || cs.columnGap || "0");
    return isNaN(g) ? 0 : g;
  }

  function calcStep() {
    if (cards.length === 0) return 0;
    const w0 = cards[0].getBoundingClientRect().width;
    const gap = getGap();
    return w0 + gap;
  }

  // ✅ মূল ফিক্স এখানে
  function setViewportWidth() {
    const gap = getGap();
    const w0  = cards[0]?.getBoundingClientRect().width || 0;

    if (VISIBLE === 1) {
      // মোবাইল: viewport = কার্ডের প্রস্থ (parent নয়)
      viewport.style.width    = Math.round(w0) + "px";
      viewport.style.maxWidth = Math.round(w0) + "px";
      viewport.style.overflow = "visible";   // বাম/ডান কাটা যাবে না
    } else {
      // ডেস্কটপ: ২ কার্ড + ১ gap
      const vw = w0 * VISIBLE + gap * (VISIBLE - 1);
      viewport.style.width    = Math.round(vw) + "px";
      viewport.style.maxWidth = "100%";
      viewport.style.overflow = "hidden";
    }
    viewport.style.margin = "0 auto";

    // slide step আপডেট
    stepPx = calcStep();
  }

  function goTo(i) {
    if (isAnimating) return;
    const next = Math.max(0, Math.min(i, maxIndex));
    if (next === index) return;
    isAnimating = true;
    index = next;
    track.style.transform = `translateX(${-index * stepPx}px)`;
    pills.forEach((p, k) =>
      p.classList.toggle("clntrvw-crdpill-actv", k === index)
    );
    setTimeout(() => { isAnimating = false; }, SLIDE_MS + 30);
  }

  function startAutoplay() {
    stopAutoplay();
    autoTimer = setInterval(() => {
      const nextIndex = index + 1 > maxIndex ? 0 : index + 1;
      goTo(nextIndex);
    }, AUTOPLAY_MS);
  }
  function stopAutoplay() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

  pills.forEach((pill, i) => {
    pill.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(i);
      startAutoplay();
    });
  });

  function init() {
    setViewportWidth();
    track.style.transform = "translateX(0)";
    pills.forEach((p, k) =>
      p.classList.toggle("clntrvw-crdpill-actv", k === index)
    );
    startAutoplay();
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newVisible = window.innerWidth <= 880 ? 1 : 2;
      if (newVisible !== VISIBLE) {
        VISIBLE = newVisible;
        maxIndex = Math.max(0, cards.length - VISIBLE);
        index = 0; // রিসেট
      }
      setViewportWidth();
      track.style.transform = `translateX(${-index * stepPx}px)`;
    }, 150);
  });

  init();
})();


















// Helper: open smoothly then uncap height (so it can grow on wrap)
function openPanel(card, ans, durationMs = 350) {
  // Set explicit height to animate from 0 -> content height
  ans.style.maxHeight = ans.scrollHeight + "px";
  card.setAttribute("aria-expanded", "true");
  const btn = card.querySelector(".faq-toggle");
  if (btn) btn.setAttribute("aria-expanded", "true");

  // After transition, remove the cap so future line wraps don't clip
  window.clearTimeout(ans._uncapTimer);
  ans._uncapTimer = window.setTimeout(() => {
    ans.style.maxHeight = "none"; // natural height
  }, durationMs);
}

// Helper: close smoothly even if currently uncapped
function closePanel(card, ans) {
  // If uncapped, set current pixel height first to allow animation
  if (ans.style.maxHeight === "none") {
    ans.style.maxHeight = ans.scrollHeight + "px";
  }
  // Force reflow to ensure the browser registers the height before going to 0
  // eslint-disable-next-line no-unused-expressions
  ans.offsetHeight; 
  ans.style.maxHeight = "0px";
  card.setAttribute("aria-expanded", "false");
  const btn = card.querySelector(".faq-toggle");
  if (btn) btn.setAttribute("aria-expanded", "false");
}

document.querySelectorAll(".faq-card").forEach((card) => {
  const btn = card.querySelector(".faq-toggle");
  const ans = card.querySelector(".faq-ans");

  // Start collapsed
  ans.style.maxHeight = "0px";

  // Click to toggle
  btn.addEventListener("click", () => {
    const isOpen = card.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closePanel(card, ans);
    } else {
      openPanel(card, ans);
    }
  });
});

// If you want only one open at a time, uncomment below:
/*
document.querySelectorAll(".faq-card .faq-toggle").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const currentCard = e.currentTarget.closest(".faq-card");
    document.querySelectorAll(".faq-card[aria-expanded='true']").forEach((card) => {
      if (card !== currentCard) {
        const ans = card.querySelector(".faq-ans");
        closePanel(card, ans);
      }
    });
  });
});
*/

// Handle viewport changes: if a panel is open AND still capped, recalc height
window.addEventListener("resize", () => {
  document.querySelectorAll(".faq-card[aria-expanded='true'] .faq-ans").forEach((ans) => {
    if (ans.style.maxHeight !== "none") {
      ans.style.maxHeight = ans.scrollHeight + "px";
    }
  });
});



























/* ========== FOOTER SUBSCRIBE (own toast, same design) ========== */
(() => {
  const form  = document.getElementById('footerSubscribeForm');
  const input = document.getElementById('footerEmail');
  const err   = document.getElementById('footerError');
  const toast = document.getElementById('footerToast'); // <-- footer-only toast

  if (!form || !input || !err || !toast) return;

  let toastTimer;
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  // Clear error if user fixes email while typing
  input.addEventListener('input', () => {
    if (isValidEmail(input.value.trim())) {
      err.hidden = true;
      input.classList.remove('invalid');
      input.setCustomValidity('');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();

    if (!isValidEmail(email)) {
      err.hidden = false;
      input.classList.add('invalid');
      input.setCustomValidity('Enter a valid email (e.g., name@email.com)');
      input.reportValidity();
      input.focus();
      return;
    }

    // success
    err.hidden = true;
    input.classList.remove('invalid');
    input.setCustomValidity('');
    input.value = '';

    // show footer toast
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('is-open'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-open');
      setTimeout(() => (toast.hidden = true), 250);
    }, 1500);
  });
})();

// ========== FOOTER SUBSCRIBE (End) ==========
