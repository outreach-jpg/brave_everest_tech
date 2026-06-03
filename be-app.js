/* Brave Everest — interactions: nav, reveal, parallax, modal, mobile menu */
(function () {
  "use strict";

  /* ---- nav scroll state ---- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- reveal on scroll ---- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }

  /* ---- parallax (hero blobs + mark, gradient drift) ---- */
  const parallax = Array.from(document.querySelectorAll("[data-par]"));
  let ticking = false;
  function applyParallax() {
    const y = window.scrollY;
    parallax.forEach((el) => {
      const sp = parseFloat(el.getAttribute("data-par")) || 0.1;
      el.style.transform = `translate3d(0, ${y * sp}px, 0)`;
    });
    ticking = false;
  }
  if (!reduce && parallax.length) {
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(applyParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
    // pointer drift on hero blobs
    const hero = document.querySelector(".hero");
    if (hero) {
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        hero.querySelectorAll("[data-drift]").forEach((b, i) => {
          const m = (i + 1) * 14;
          b.style.setProperty("--mx", `${dx * m}px`);
          b.style.setProperty("--my", `${dy * m}px`);
        });
      });
    }
  }

  /* ---- smooth anchor + close menus ---- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        closeMobile();
        const top = t.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      }
    });
  });

  /* ---- mobile menu ---- */
  const mm = document.getElementById("mobileMenu");
  const tg = document.getElementById("navToggle");
  function closeMobile() { if (mm) mm.classList.remove("open"); document.body.style.overflow = ""; }
  if (tg && mm) {
    tg.addEventListener("click", () => {
      mm.classList.toggle("open");
      document.body.style.overflow = mm.classList.contains("open") ? "hidden" : "";
    });
  }

  /* ---- demo modal ---- */
  const modal = document.getElementById("demoModal");
  const calEmbed = document.getElementById("calEmbed");
  let calLoaded = false;
  function accentHex() {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    // Calendly wants a hex without #; fall back to crimson
    const m = v.match(/#([0-9a-f]{6})/i);
    return m ? m[1] : "9b2030";
  }
  function initCalendly() {
    if (calLoaded || !calEmbed) return;
    const url = calEmbed.getAttribute("data-cal");
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    function go() {
      if (!(window.Calendly && window.Calendly.initInlineWidget)) { setTimeout(go, 150); return; }
      calEmbed.innerHTML = "";
      window.Calendly.initInlineWidget({
        url: url + "?hide_gdpr_banner=1&background_color=" + (dark ? "1f2533" : "ffffff") +
             "&text_color=" + (dark ? "f2f4f8" : "22262e") + "&primary_color=" + accentHex(),
        parentElement: calEmbed,
      });
      calLoaded = true;
    }
    go();
  }
  function openModal() { if (modal) { modal.classList.add("open"); document.body.style.overflow = "hidden"; initCalendly(); } }
  function closeModal() { if (modal) { modal.classList.remove("open"); document.body.style.overflow = ""; } }
  document.querySelectorAll("[data-demo]").forEach((b) =>
    b.addEventListener("click", (e) => { e.preventDefault(); closeMobile(); openModal(); })
  );
  if (modal) {
    modal.querySelector(".modal-scrim").addEventListener("click", closeModal);
    modal.querySelector(".x").addEventListener("click", closeModal);
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeMobile(); } });

  /* ---- year ---- */
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
