/* ============================================================
   STACKLY — main.js
   Shared public-site behaviour: navbar, reveal animations,
   counters, lightbox, accordion, toasts, image fallback.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Tiny helpers exposed globally ---------- */
  window.SL = window.SL || {};

  SL.qs = (sel, ctx) => (ctx || document).querySelector(sel);
  SL.qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  SL.toast = function (title, msg, type) {
    type = type || "success";
    let wrap = document.querySelector(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      document.body.appendChild(wrap);
    }
    const iconMap = { success: "\u2713", error: "\u26A0", info: "\u2139" };
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.setAttribute("role", "status");
    el.innerHTML =
      '<div style="font-size:1.2rem">' + (iconMap[type] || "\u2713") + "</div>" +
      "<div><strong>" + title + "</strong>" + (msg ? "<p>" + msg + "</p>" : "") + "</div>";
    wrap.appendChild(el);
    setTimeout(() => {
      el.classList.add("hide");
      setTimeout(() => el.remove(), 320);
    }, 3600);
  };

  SL.safeImage = function (img) {
    const fallback =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">' +
          '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#7fc8f8"/><stop offset="1" stop-color="#8a6df1"/>' +
          "</linearGradient></defs>" +
          '<rect width="800" height="600" fill="url(#g)"/>' +
          '<text x="400" y="300" font-family="Arial" font-size="150" fill="rgba(255,255,255,.6)" text-anchor="middle">STACKLY</text>' +
          "</svg>"
      );
    img.addEventListener("error", function handler() {
      img.removeEventListener("error", handler);
      img.src = fallback;
    });
  };

  /* ---------- Navbar ---------- */
  function initNav() {
    const nav = document.querySelector(".navbar");
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");

    if (toggle && links) {
      SL.qsa(".nav-actions .btn").forEach((button) => {
        const mobileButton = button.cloneNode(true);
        mobileButton.classList.add("mobile-nav-auth");
        links.appendChild(mobileButton);
      });
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        links.style.display = open ? "flex" : "none";
        links.style.visibility = open ? "visible" : "hidden";
        links.style.opacity = open ? "1" : "0";
        document.body.style.overflow = open ? "hidden" : "";
      });
      SL.qsa("a", links).forEach((a) =>
        a.addEventListener("click", () => {
          links.classList.remove("open");
          toggle.classList.remove("open");
          links.style.display = "none";
          links.style.visibility = "hidden";
          links.style.opacity = "0";
          document.body.style.overflow = "";
        })
      );
    }

    if (nav) {
      const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // active link based on current file
    const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    SL.qsa(".nav-links a").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === page) a.classList.add("active");
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const items = SL.qsa(".reveal, .reveal-left, .reveal-right");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((i) => io.observe(i));
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    const nums = SL.qsa("[data-count]");
    if (!nums.length) return;
    const run = (el) => {
      const target = parseFloat(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      const dur = 1500;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + suffix;
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) return nums.forEach(run);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    nums.forEach((n) => io.observe(n));
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    const items = SL.qsa("[data-lightbox]");
    if (!items.length) return;
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML =
      '<button class="lb-close" aria-label="Close gallery">&times;</button>' +
      '<button class="lb-prev" aria-label="Previous image">&#8249;</button>' +
      '<img alt="Gallery preview">' +
      '<button class="lb-next" aria-label="Next image">&#8250;</button>';
    document.body.appendChild(box);

    const imgEl = box.querySelector("img");
    const srcs = items.map((i) => i.getAttribute("data-src") || (i.querySelector("img") && i.querySelector("img").src) || i.src);
    let idx = 0;

    const show = (i) => {
      idx = (i + srcs.length) % srcs.length;
      imgEl.src = srcs[idx];
      imgEl.style.animation = "none";
      void imgEl.offsetWidth;
      imgEl.style.animation = "";
    };
    const open = (i) => {
      show(i);
      box.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      box.classList.remove("open");
      document.body.style.overflow = "";
    };

    items.forEach((it, i) => it.addEventListener("click", () => open(i)));
    box.querySelector(".lb-close").addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", (e) => { e.stopPropagation(); show(idx - 1); });
    box.querySelector(".lb-next").addEventListener("click", (e) => { e.stopPropagation(); show(idx + 1); });
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Accordion ---------- */
  function initAccordion() {
    SL.qsa(".accordion").forEach((acc) => {
      const items = SL.qsa(".accordion-item", acc);
      items.forEach((item) => {
        const head = item.querySelector(".accordion-head");
        const body = item.querySelector(".accordion-body");
        if (!head || !body) return;
        head.addEventListener("click", () => {
          const isOpen = item.classList.contains("open");
          items.forEach((o) => {
            o.classList.remove("open");
            const b = o.querySelector(".accordion-body");
            if (b) b.style.maxHeight = null;
            const h = o.querySelector(".accordion-head");
            if (h) h.setAttribute("aria-expanded", "false");
          });
          if (!isOpen) {
            item.classList.add("open");
            body.style.maxHeight = body.scrollHeight + "px";
            head.setAttribute("aria-expanded", "true");
          }
        });
      });
    });
  }

  /* ---------- Gallery / program filters ---------- */
  function initFilters() {
    SL.qsa("[data-filter-group]").forEach((group) => {
      const targetSel = group.getAttribute("data-filter-target");
      const target = document.querySelector(targetSel);
      SL.qsa("[data-filter]", group).forEach((btn) => {
        btn.addEventListener("click", () => {
          SL.qsa("[data-filter]", group).forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const val = btn.getAttribute("data-filter");
          if (!target) return;
          SL.qsa("[data-filter-item]", target).forEach((el) => {
            const cats = (el.getAttribute("data-filter-item") || "").split(/\s+/).filter(Boolean);
            const show = val === "all" || cats.indexOf(val) !== -1;
            el.style.display = show ? "" : "none";
            if (show) {
              el.classList.remove("in");
              void el.offsetWidth;
              el.classList.add("in");
            }
          });
        });
      });
    });
  }

  /* ---------- Newsletter ---------- */
  function initNewsletter() {
    SL.qsa("[data-newsletter]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = form.querySelector("input[type=email]");
        if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          SL.toast("Invalid email", "Please enter a valid email address.", "error");
          input.focus();
          return;
        }
        SL.toast("You're subscribed!", "Thanks for joining the STACKLY family.");
        form.reset();
      });
    });
  }

  /* ---------- Image fallback + year ---------- */
  function initImages() {
    SL.qsa("img").forEach(SL.safeImage);
  }
  function initYear() {
    SL.qsa("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }
  function initSocialLinks() {
    SL.qsa(".socials a").forEach((link) => (link.href = "404.html"));
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initReveal();
    initCounters();
    initLightbox();
    initAccordion();
    initFilters();
    initNewsletter();
    initImages();
    initYear();
    initSocialLinks();
  });
})();
