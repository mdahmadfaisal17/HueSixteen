  const tabs = document.querySelectorAll('#serviceTabs li');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // remove active from all
      tabs.forEach(t => t.classList.remove('active'));
      // add active to clicked one
      tab.classList.add('active');
    });
  });














/* ============== LEAD POPUP + FORM SYSTEM (CLEAN VERSION) ============== */
(() => {
  const modal = document.getElementById('leadModal');
  const overlay = document.getElementById('leadOverlay');
  const btnClose = document.getElementById('leadClose');
  const form = document.getElementById('leadForm');
  const toast = document.getElementById('leadToast');
  const nameInp = document.getElementById('leadName');

  if (!modal || !overlay || !btnClose || !form || !toast) return;

  const openers = document.querySelectorAll('.open-lead, #ctaTalk, #drawerCta');
  let open = false;

  /* -------- Modal Controls -------- */
  const showModal = () => {
    modal.classList.add('is-open');
    overlay.hidden = false;
    overlay.style.opacity = '1';
    open = true;
    form.reset();
    setTimeout(() => nameInp?.focus(), 160);
  };

  const hideModal = () => {
    modal.classList.remove('is-open');
    overlay.style.opacity = '0';
    setTimeout(() => overlay.hidden = true, 200);
    open = false;
  };

  openers.forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault(); 
    showModal();
  }));

  btnClose.addEventListener('click', hideModal);
  overlay.addEventListener('click', hideModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideModal(); });

  /* -------- Custom Budget Logic -------- */
  const budgetSel = document.getElementById('leadBudget');
  const wrap = document.getElementById('customBudgetWrap');
  const amt = document.getElementById('customBudget');

  if (budgetSel) {
    const toggle = () => {
      if (budgetSel.value === 'custom') {
        wrap.hidden = false;
        amt.required = true;
      } else {
        wrap.hidden = true;
        amt.required = false;
        amt.value = '';
      }
    };
    budgetSel.addEventListener('change', toggle);
    toggle();
  }

  /* -------- EmailJS Submission -------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    emailjs.sendForm(
      "service_8iy7qp2",
      "template_vc1ixke",
      this
    )
    .then(() => {
      toast.hidden = false;
      toast.classList.add("is-open");
      setTimeout(() => toast.classList.remove("is-open"), 3000);
      hideModal();
      form.reset();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to send — try again.");
    });
  });

})();



/* ============== EMAILJS INIT ============== */







  