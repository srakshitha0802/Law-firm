/**
 * SEKHAR ASSOCIATES LAW FIRM - MAIN JAVASCRIPT
 * Replicating and enhancing interactive features, sliders, animations,
 * modals, and counter effects from aglaw.in
 */

// Advocate Data for Interactive Modals
const teamMembers = {
  1: {
    id: 1,
    name: "S. CHANDRA SEKHAR",
    designation: "Founder & Managing Partner",
    standing: "20+ Years Active Court Standing",
    experience: "20+ Years Courtroom Experience",
    image: "public/Chandra Sekhar.jpg",
    phone: "+91 8500742555",
    altPhone: "+91 9441401781",
    email: "contact@sekharassociates.com",
    enrolment: "Bar Council of Andhra Pradesh & Telangana — Enrolment No. AP/1428/2004",
    education: "LL.M. (Osmania University), LL.B.",
    languages: "English • Telugu • Hindi",
    courts: "Hon'ble High Courts of Andhra Pradesh & Telangana, District & Sessions Courts, Special Appellate Tribunals",
    practiceAreas: [
      "Civil Disputes & Ancestral Title Suits",
      "Criminal Defense, Bail & Trial Advocacy",
      "High Court Writs (Art. 226/227) & Appeals",
      "Complex Land & Property Litigations",
      "Commercial Dispute Resolution & Arbitrations"
    ],
    bio: `<div class="dossier-credentials">
            <span class="cred-pill cred-pill-gold">Verified Standing: 20+ Years</span>
            <span class="cred-pill">Bar Council Enrolment: AP/1428/2004</span>
            <span class="cred-pill">LL.M. (Osmania University), LL.B.</span>
          </div>
          <p>Mr. S. Chandra Sekhar is the Founder and Managing Partner of Sekhar Associates Law Firm. With more than two decades of dedicated, hands-on trial practice and appellate advocacy, he has personally guided thousands of families, landowners, and commercial enterprises through difficult legal battles.</p>
          <p>Known for his grounded approach, deep understanding of procedural law, and compelling courtroom argument, he leads a team of 10+ specialized legal professionals handling cases across all districts of Andhra Pradesh and Telangana. He firmly believes in giving clients honest, straightforward assessments from day one—explaining complex legal realities in plain language so clients always feel secure and informed.</p>
          <div class="dossier-subheading">Core Areas of Advocacy</div>
          <ul class="dossier-list">
            <li><strong>Civil & Property Litigations:</strong> Comprehensive land disputes, ancestral partition suits, permanent injunctions, and specific performance of contracts.</li>
            <li><strong>High Court Writ Petitions:</strong> Protection of fundamental and civil rights under Articles 226 and 227 before the High Courts at Amaravati and Hyderabad.</li>
            <li><strong>Criminal Trial Defense:</strong> Regular and anticipatory bails, sessions trial defense, quashing petitions, and protection from unlawful harassment.</li>
            <li><strong>Arbitration & Commercial Matters:</strong> Contractual enforcement, domestic arbitration, and dispute settlement.</li>
          </ul>
          <div class="dossier-footer-info">
            <div><strong>Jurisdiction:</strong> Cases taken from all over Andhra Pradesh and Telangana</div>
            <div><strong>Languages:</strong> English, Telugu, Hindi</div>
          </div>`
  },
  2: {
    id: 2,
    name: "B. NAGALAKSHMI DEVI",
    designation: "Senior Partner & Head of Matrimonial & Civil Practice",
    standing: "15+ Years Courtroom Standing",
    experience: "15+ Years Courtroom Experience",
    image: "public/Nagalakshmi.jpg",
    phone: "+91 9441401781",
    altPhone: "+91 8500742555",
    email: "nagalakshmi@sekharassociates.com",
    enrolment: "Bar Council of Andhra Pradesh & Telangana — Enrolment No. TS/892/2009",
    education: "LL.M., LL.B. (Prasuna Law College)",
    languages: "English • Telugu • Hindi • Kannada",
    courts: "Family Courts, City Civil Courts, District & Sessions Courts, High Court",
    practiceAreas: [
      "Family & Matrimonial Matters (Divorce, Maintenance, Custody)",
      "Property Title Scrutiny & Partition Suits",
      "Civil Injunctions & Revenue Disputes",
      "Commercial Conciliation & Amicable Mediation",
      "Consumer Protection Redressal"
    ],
    bio: `<div class="dossier-credentials">
            <span class="cred-pill cred-pill-gold">Verified Standing: 15+ Years</span>
            <span class="cred-pill">Bar Council Enrolment: TS/892/2009</span>
            <span class="cred-pill">LL.M., LL.B. — Prasuna Law College</span>
          </div>
          <p>Advocate B. Nagalakshmi Devi brings over 15 years of distinguished courtroom advocacy and compassionate counsel to Sekhar Associates. Holding both LL.M. and LL.B. degrees from Prasuna Law College, she has earned deep respect for her sharp statutory precision, thorough document verification, and empathetic client relationships.</p>
          <p>Fluent in four languages (English, Telugu, Hindi, Kannada), she regularly assists diverse clients across Andhra Pradesh and Telangana, helping families resolve delicate matrimonial and property partition matters with dignity, speed, and protective legal structures.</p>
          <div class="dossier-subheading">Core Areas of Advocacy</div>
          <ul class="dossier-list">
            <li><strong>Family & Matrimonial Law:</strong> Dignified handling of mutual and contested divorce, custody of minors, interim and permanent maintenance, and domestic dispute mediation.</li>
            <li><strong>Property Title & Partition Scrutiny:</strong> In-depth historical searches, family partition settlements, mutation verification, and succession certificates.</li>
            <li><strong>Civil Protection & Injunctions:</strong> Preserving client possession, defending against illegal encroachment, and recovery proceedings.</li>
            <li><strong>Mediation & ADR:</strong> Amicable settlement of multi-party civil and commercial disagreements without prolonged litigation.</li>
          </ul>
          <div class="dossier-footer-info">
            <div><strong>Jurisdiction:</strong> District Courts & High Courts across AP & Telangana</div>
            <div><strong>Languages:</strong> English, Telugu, Hindi, Kannada</div>
          </div>`
  },
  3: {
    id: 3,
    name: "S. DEEKSHITHA",
    designation: "Associate Partner (B.A., LL.B. Hons)",
    standing: "Associate Partner",
    experience: "Active Legal Practice",
    image: "public/Deekshitha.jpg",
    phone: "+91 8500742555",
    altPhone: "+91 9441401781",
    email: "deekshitha@sekharassociates.com",
    enrolment: "Bar Council of Andhra Pradesh & Telangana — Enrolment No. TS/2140/2022",
    education: "B.A., LL.B. (Hons) — Prasuna Law College",
    languages: "English • Telugu • Hindi",
    courts: "Commercial Courts, District Courts, High Court, Consumer Commissions",
    practiceAreas: [
      "Commercial Litigation & Breach of Contract",
      "Cheque Bounce Prosecutions (Sec. 138 NI Act)",
      "High Court Writ Research & Drafting",
      "Consumer Protection Disputes",
      "Corporate Due Diligence & Statutory Notices"
    ],
    bio: `<div class="dossier-credentials">
            <span class="cred-pill cred-pill-gold">Associate Partner</span>
            <span class="cred-pill">Bar Council Enrolment: TS/2140/2022</span>
            <span class="cred-pill">B.A., LL.B. (Hons) — Prasuna Law College</span>
          </div>
          <p>Advocate S. Deekshitha holds a B.A., LL.B. (Hons) degree from Prasuna Law College and represents the forward-thinking modern litigation wing of Sekhar Associates. Combining meticulous case research, energetic legal drafting, and rapid case follow-ups, she plays a vital role across trial court proceedings and appellate submissions.</p>
          <p>She specializes in commercial disputes, Section 138 cheque bounce proceedings, consumer dispute redressal, and high-precision pleading preparation before District Courts and Tribunals across Andhra Pradesh and Telangana.</p>
          <div class="dossier-subheading">Core Areas of Advocacy</div>
          <ul class="dossier-list">
            <li><strong>Commercial & Contractual Law:</strong> Business agreements, recovery suits, and breach of contractual obligations.</li>
            <li><strong>Negotiable Instruments Act (Sec. 138):</strong> Prosecution and defense strategies in dishonour of cheques.</li>
            <li><strong>Pleadings & Legal Research:</strong> Collation of authoritative judicial precedents for trial and appellate filings.</li>
            <li><strong>Consumer Protection:</strong> Protecting consumers and defending businesses before Consumer Dispute Redressal Commissions.</li>
          </ul>
          <div class="dossier-footer-info">
            <div><strong>Jurisdiction:</strong> All District Courts, Tribunals & High Court</div>
            <div><strong>Languages:</strong> English, Telugu, Hindi</div>
          </div>`
  }
};

// Safe Storage Wrapper (handles file://, restricted iframes, private browsing)
const safeStorage = {
  get: function (key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return window.__fallbackStorage ? window.__fallbackStorage[key] : null;
    }
  },
  set: function (key, val) {
    try {
      sessionStorage.setItem(key, val);
    } catch (e) {
      window.__fallbackStorage = window.__fallbackStorage || {};
      window.__fallbackStorage[key] = val;
    }
  }
};

let currentMemberId = 1;

// Document Ready Initialization
function safeInit(fn, name) {
  try {
    fn();
  } catch (err) {
    console.warn(`[Sekhar Associates] Init error in ${name}:`, err);
  }
}

function runAllInits() {
  safeInit(initDisclaimer, "Disclaimer");
  safeInit(initStickyHeader, "StickyHeader");
  safeInit(initMobileNav, "MobileNav");
  safeInit(initCounters, "Counters");
  safeInit(initAwardsSlider, "AwardsSlider");
  safeInit(initTestimonialsSlider, "TestimonialsSlider");
  safeInit(initVideoModal, "VideoModal");
  safeInit(initContactForm, "ContactForm");

  // Initialize AOS if loaded
  if (typeof AOS !== "undefined") {
    try {
      AOS.init({
        duration: 900,
        easing: "ease-out-cubic",
        once: true,
        offset: 60
      });
      document.body.classList.add("aos-enabled");
    } catch (e) {
      console.warn("AOS init failed:", e);
      document.body.classList.add("aos-disabled");
    }
  } else {
    document.body.classList.add("aos-disabled");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runAllInits);
} else {
  runAllInits();
}

/* ==========================================================================
   1. DISCLAIMER MODAL (Bar Council of India)
   ========================================================================== */
function initDisclaimer() {
  const disclaimerPopup = document.querySelector(".dsclaimer_popup");
  const proceedBtn = document.getElementById("proceedBtn");
  const disclaimerTrigger = document.getElementById("Disclaimer");

  if (!disclaimerPopup) return;

  // Show if not accepted in this session
  if (!safeStorage.get("disclaimerAccepted")) {
    disclaimerPopup.style.display = "flex";
  } else {
    disclaimerPopup.style.display = "none";
  }

  if (proceedBtn) {
    proceedBtn.addEventListener("click", function (e) {
      e.preventDefault();
      safeStorage.set("disclaimerAccepted", "true");
      disclaimerPopup.style.display = "none";
    });
  }

  if (disclaimerTrigger) {
    disclaimerTrigger.addEventListener("click", function (e) {
      e.preventDefault();
      disclaimerPopup.style.display = "flex";
    });
  }
}

/* ==========================================================================
   2. STICKY HEADER
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector(".header-main");
  if (!header) return;

  let isFixed = false;
  let isNavFixed = false;
  let ticking = false;

  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scroll = window.scrollY;
        const shouldBeFixed = scroll >= 30;
        const shouldBeNavFixed = scroll >= 100;

        if (shouldBeFixed !== isFixed) {
          isFixed = shouldBeFixed;
          header.classList.toggle("fixed", isFixed);
        }
        if (shouldBeNavFixed !== isNavFixed) {
          isNavFixed = shouldBeNavFixed;
          header.classList.toggle("headerNavFixed", isNavFixed);
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   3. MOBILE NAVIGATION & HAMBURGER
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.getElementById("header__humburgericon");
  const nav = document.querySelector(".navinr");

  if (hamburger && nav) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("open");
      nav.classList.toggle("open");
      document.body.classList.toggle("hidden");
    });

    // Close mobile nav on regular link click, or toggle submenu on dropdown link
    nav.querySelectorAll("li").forEach(li => {
      const sub = li.querySelector(".sub_menuinr");
      const parentLink = li.querySelector(":scope > a");

      if (sub && parentLink) {
        // Dropdown link toggle on mobile
        parentLink.addEventListener("click", function (e) {
          if (window.innerWidth <= 992) {
            e.preventDefault();
            li.classList.toggle("submenu-open");
          }
        });
      } else if (parentLink) {
        parentLink.addEventListener("click", function () {
          if (window.innerWidth <= 992) {
            hamburger.classList.remove("open");
            nav.classList.remove("open");
            document.body.classList.remove("hidden");
          }
        });
      }

      // Close mobile menu when a submenu child link is clicked
      if (sub) {
        sub.querySelectorAll("a").forEach(subLink => {
          subLink.addEventListener("click", function () {
            if (window.innerWidth <= 992) {
              hamburger.classList.remove("open");
              nav.classList.remove("open");
              document.body.classList.remove("hidden");
            }
          });
        });
      }
    });
  }

  // Quick search toggle
  const searchTrigger = document.querySelector(".search_trigger_btn");
  const searchBox = document.querySelector(".srchopn");
  if (searchTrigger && searchBox) {
    searchTrigger.addEventListener("click", function(e) {
      e.preventDefault();
      searchBox.style.display = searchBox.style.display === "block" ? "none" : "block";
    });
  }
}

/* ==========================================================================
   4. STAT COUNTERS ANIMATION
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll(".counter1");
  if (!counters.length) return;

  let triggered = false;

  const triggerAll = () => {
    if (triggered) return;
    triggered = true;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute("data-count"), 10);
      if (!isNaN(target)) {
        animateCount(counter, target, 2000);
      }
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerAll();
        }
      });
    }, { threshold: 0.2 });

    const welcomeSection = document.querySelector(".wlcm-associat") || counters[0];
    if (welcomeSection) {
      observer.observe(welcomeSection);
    }
  } else {
    triggerAll();
  }
}

function animateCount(el, target, duration) {
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeOut * target);

    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/* ==========================================================================
   5. TEAM MEMBER MODAL POPUP
   ========================================================================== */
function showMemberPopup(memberId) {
  const member = teamMembers[memberId];
  if (!member) return;

  currentMemberId = memberId;

  const modal = document.getElementById("member-popup");
  const modalName = document.getElementById("modalMemberName");
  const modalDesig = document.getElementById("modalMemberDesig");
  const modalImg = document.getElementById("modalMemberImg");
  const modalBio = document.getElementById("modalMemberBio");

  if (modalName) modalName.textContent = member.name;
  if (modalDesig) modalDesig.textContent = `${member.designation} (${member.experience})`;
  if (modalImg) {
    modalImg.src = member.image;
    modalImg.alt = member.name;
  }
  if (modalBio) modalBio.innerHTML = member.bio;

  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function hideMemberPopup() {
  const modal = document.getElementById("member-popup");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function nextMember() {
  const ids = Object.keys(teamMembers).map(Number);
  const currentIndex = ids.indexOf(currentMemberId);
  const nextIndex = (currentIndex + 1) % ids.length;
  showMemberPopup(ids[nextIndex]);
}

function prevMember() {
  const ids = Object.keys(teamMembers).map(Number);
  const currentIndex = ids.indexOf(currentMemberId);
  const prevIndex = (currentIndex - 1 + ids.length) % ids.length;
  showMemberPopup(ids[prevIndex]);
}

// Close modal when clicking outside
window.addEventListener("click", function (e) {
  const modal = document.getElementById("member-popup");
  if (e.target === modal) {
    hideMemberPopup();
  }
});

/* ==========================================================================
   6. AWARDS CAROUSEL SLIDER
   ========================================================================== */
function initAwardsSlider() {
  const slider = document.querySelector(".awrds_slider");
  if (!slider) return;

  let pos = 0;
  const items = slider.children;
  if (!items.length) return;

  let itemWidth = items[0].getBoundingClientRect().width + 20;

  window.addEventListener("resize", () => {
    itemWidth = items[0].getBoundingClientRect().width + 20;
  });

  // Auto-scroll loop
  let autoSlide = setInterval(() => {
    slideAwards(1);
  }, 3500);

  slider.parentElement.addEventListener("mouseenter", () => clearInterval(autoSlide));
  slider.parentElement.addEventListener("mouseleave", () => {
    autoSlide = setInterval(() => slideAwards(1), 3500);
  });
}

function slideAwards(direction) {
  const slider = document.querySelector(".awrds_slider");
  if (!slider) return;

  const items = slider.children;
  const total = items.length;
  const visible = window.innerWidth < 768 ? 1 : (window.innerWidth < 1200 ? 2 : 4);
  const maxPos = total - visible;

  slider.dataset.pos = slider.dataset.pos || 0;
  let current = parseInt(slider.dataset.pos, 10) + direction;

  if (current > maxPos) current = 0;
  if (current < 0) current = maxPos;

  slider.dataset.pos = current;
  const itemWidth = items[0].getBoundingClientRect().width + 20;
  slider.style.transform = `translateX(-${current * itemWidth}px)`;
}

/* ==========================================================================
   7. TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialsSlider() {
  const slides = document.querySelectorAll(".testim_slide");
  if (!slides.length) return;

  let current = 0;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.style.display = i === index ? "block" : "none";
    });
  }

  showSlide(current);

  const prevBtn = document.getElementById("testimPrev");
  const nextBtn = document.getElementById("testimNext");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    });
  }

  // Auto rotate testimonials every 6 seconds
  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 6000);
}

/* ==========================================================================
   8. VIDEO MODAL POPUP
   ========================================================================== */
function initVideoModal() {
  const openBtn = document.querySelector(".vdio-cin");
  const modal = document.querySelector(".ytube_vdeo");
  const closeBtn = document.querySelector(".close_yt_vd");
  const video = modal ? modal.querySelector("video") : null;
  const iframe = modal ? modal.querySelector("iframe") : null;

  if (openBtn && modal) {
    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else if (iframe && !iframe.src) {
        iframe.src = "https://www.youtube.com/embed/_9-Um_uBmWA?autoplay=1";
      }
    });

    function closeModal() {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
      if (video) {
        video.pause();
      }
      if (iframe) {
        iframe.src = "";
      }
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.style.display === "flex") {
        closeModal();
      }
    });
  }
}

/* ==========================================================================
   9. CONTACT FORM INTERACTION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("inquiryForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    const phone = form.querySelector('[name="phone"]').value;

    alert(`Thank you, ${name}! Your legal inquiry has been registered. Our advocates in Kurnool will reach out to you at ${phone} promptly.`);
    form.reset();
  });
}
