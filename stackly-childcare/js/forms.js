/* ============================================================
   STACKLY — forms.js
   Validation helpers, contact / inquiry forms, generic modal.
   ============================================================ */
(function () {
  "use strict";
  const SL = (window.SL = window.SL || {});
  SL.qs = SL.qs || ((s, c) => (c || document).querySelector(s));
  SL.qsa = SL.qsa || ((s, c) => Array.from((c || document).querySelectorAll(s)));

  SL.validation = {
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()),
    phone: (v) => /^[+]?[\d\s()-]{7,18}$/.test(String(v).trim()),
    required: (v) => String(v).trim().length > 0,
    min: (v, n) => String(v).trim().length >= n,
    match: (a, b) => a === b,
  };

  SL.setFieldError = function (input, message) {
    const field = input.closest(".field");
    if (!field) return;
    const msg = field.querySelector(".msg");
    field.classList.toggle("error", !!message);
    field.classList.toggle("ok", !message && String(input.value).trim() !== "");
    if (msg && message) msg.textContent = message;
  };

  SL.validateInput = function (input) {
    const rules = (input.getAttribute("data-rules") || "").split("|").filter(Boolean);
    const label = input.getAttribute("data-label") || "This field";
    let error = "";
    for (const rule of rules) {
      const [name, arg] = rule.split(":");
      if (name === "required" && !SL.validation.required(input.value)) error = label + " is required.";
      else if (name === "email" && input.value && !SL.validation.email(input.value)) error = "Enter a valid email address.";
      else if (name === "phone" && input.value && !SL.validation.phone(input.value)) error = "Enter a valid phone number.";
      else if (name === "min" && !SL.validation.min(input.value, parseInt(arg, 10))) error = label + " must be at least " + arg + " characters.";
      else if (name === "match") {
        const other = document.querySelector('[name="' + arg + '"]');
        if (other && !SL.validation.match(input.value, other.value)) error = "Passwords do not match.";
      } else if (name === "checked" && !input.checked) error = "Please accept to continue.";
      if (error) break;
    }
    SL.setFieldError(input, error);
    return !error;
  };

  SL.validateForm = function (form) {
    let ok = true;
    SL.qsa("[data-rules]", form).forEach((input) => {
      if (!SL.validateInput(input)) ok = false;
    });
    return ok;
  };

  /* ---------- Generic modal ---------- */
  SL.modal = (function () {
    function create() {
      if (document.querySelector(".sl-modal-backdrop")) return;
      const bd = document.createElement("div");
      bd.className = "modal-backdrop sl-modal-backdrop";
      bd.innerHTML = '<div class="modal" role="dialog" aria-modal="true"><div class="sl-modal-content"></div></div>';
      document.body.appendChild(bd);
      bd.addEventListener("click", (e) => { if (e.target === bd) close(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    }
    function open(html) {
      create();
      const bd = document.querySelector(".sl-modal-backdrop");
      bd.querySelector(".sl-modal-content").innerHTML = html;
      bd.classList.add("open");
      document.body.style.overflow = "hidden";
      bd.querySelectorAll("[data-modal-close]").forEach((b) => b.addEventListener("click", close));
    }
    function close() {
      const bd = document.querySelector(".sl-modal-backdrop");
      if (!bd) return;
      bd.classList.remove("open");
      document.body.style.overflow = "";
    }
    return { open, close };
  })();

  /* ---------- Standard demo forms (contact + inquiry) ---------- */
  function bindDemoForm(form, opts) {
    opts = opts || {};
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      const valid = SL.validateForm(form);
      if (!valid) {
        const firstErr = form.querySelector(".field.error input, .field.error select, .field.error textarea");
        if (firstErr) firstErr.focus();
        return;
      }
      const original = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending...";
      }
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = original;
        }
        form.reset();
        SL.qsa(".field", form).forEach((f) => f.classList.remove("ok", "error"));
        if (opts.success) opts.success();
        else SL.toast(opts.title || "Message sent!", opts.msg || "We'll get back to you shortly.");
      }, 900);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    SL.qsa("[data-validate-form]").forEach((form) => {
      form.addEventListener("input", (e) => {
        if (e.target.matches("[data-rules]")) SL.validateInput(e.target);
      });
      const successType = form.getAttribute("data-success");
      bindDemoForm(form, {
        title: form.getAttribute("data-success-title") || "Message sent!",
        msg: form.getAttribute("data-success-msg") || "We'll get back to you shortly.",
        success:
          successType === "panel"
            ? function () {
                const panel = document.getElementById("successPanel");
                const wrap = document.getElementById("formWrap");
                if (panel) {
                  panel.classList.remove("hidden");
                  panel.style.animation = "none";
                  void panel.offsetWidth;
                }
                if (wrap) wrap.classList.add("hidden");
                SL.toast("Message sent!", "Our team will contact you soon.");
              }
            : null,
      });
    });
  });
})();
