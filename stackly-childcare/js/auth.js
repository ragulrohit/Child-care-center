/* ============================================================
   STACKLY — auth.js  (DEMO / PROTOTYPE ONLY)
   Simulated authentication using localStorage.
   NOT secure, NOT production ready. Real auth + Google OAuth
   require a backend and a configured OAuth client ID.
   ============================================================ */
(function () {
  "use strict";
  const SL = (window.SL = window.SL || {});
  SL.qs = SL.qs || ((s, c) => (c || document).querySelector(s));
  SL.qsa = SL.qsa || ((s, c) => Array.from((c || document).querySelectorAll(s)));

  const USERS_KEY = "stackly_demo_users";
  const SESSION_KEY = "stackly_session";

  /* ---------- storage helpers ---------- */
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

  function initials(email) {
    const name = String(email).split("@")[0].replace(/[._-]/g, " ");
    return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "U";
  }
  function usernameFrom(email) { return String(email).split("@")[0]; }

  SL.session = {
    get() {
      try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
      catch (e) { return null; }
    },
    set(email) {
      const session = { email: email, username: usernameFrom(email), initials: initials(email), loggedInAt: Date.now() };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    },
    clear() { localStorage.removeItem(SESSION_KEY); },
    requireAuth() {
      if (!this.get()) {
        window.location.replace("login.html");
        return false;
      }
      return true;
    },
  };

  // expose for dashboards
  SL.usernameFrom = usernameFrom;
  SL.initials = initials;

  /* ---------- Password visibility toggle ---------- */
  function initPwToggles() {
    SL.qsa("[data-pw-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = document.getElementById(btn.getAttribute("data-pw-toggle"));
        if (!input) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.textContent = show ? "\uD83D\uDE48" : "\uD83D\uDC41";
        btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      });
    });
  }

  /* ---------- Password strength ---------- */
  function scorePassword(pw) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s; // 0-4
  }
  function initStrength() {
    const input = document.getElementById("signupPassword");
    const bar = document.getElementById("pwBar");
    const hint = document.getElementById("pwHint");
    if (!input || !bar) return;
    const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
    const colors = ["#ff5c6c", "#ff9e6d", "#ffd166", "#3ecf8e", "#1f9d6b"];
    input.addEventListener("input", () => {
      const s = scorePassword(input.value);
      const pct = input.value ? (s / 4) * 100 : 0;
      bar.style.width = pct + "%";
      bar.style.background = colors[s];
      if (hint) hint.textContent = input.value ? "Strength: " + labels[s] : "";
      input.dataset.score = s;
    });
  }

  function initRoleSwitches() {
    document.querySelectorAll("[data-role-switch]").forEach((switcher) => {
      const buttons = switcher.querySelectorAll("[data-role]");
      const hidden = switcher.parentElement.querySelector('input[type="hidden"][name="role"]');
      const setRole = (role) => {
        switcher.dataset.selected = role;
        buttons.forEach((button) => button.classList.toggle("active", button.dataset.role === role));
        if (hidden) hidden.value = role;
      };
      setRole(hidden ? hidden.value : "parent");
      buttons.forEach((button) => button.addEventListener("click", () => setRole(button.dataset.role)));
    });
  }

  /* ---------- LOGIN ---------- */
  function initLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;
    const emailEl = document.getElementById("loginEmail");
    const pwEl = document.getElementById("loginPassword");

    form.addEventListener("input", (e) => {
      if (e.target.matches("[data-rules]")) SL.validateInput(e.target);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!emailEl.value.trim() || !pwEl.value) {
        SL.toast("Enter your details", "Please enter an email and password.", "error");
        return;
      }
      const btn = form.querySelector('[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spin">\u25CF</span> Signing in...';

      setTimeout(() => {
        const email = emailEl.value.trim().toLowerCase();
        const pw = pwEl.value;
        const users = getUsers();
        const user = users.find((u) => u.email === email);

        // Persist a demo account if one doesn't exist yet
        if (!user) {
          users.push({ email: email, password: pw, role: document.getElementById("loginRole")?.value || "parent", demo: true, createdAt: Date.now() });
          saveUsers(users);
        }

        const session = SL.session.set(email);
        SL.toast("Welcome back, " + session.username + "!", "Redirecting to your dashboard...");
        setTimeout(() => window.location.href = "dashboard.html", 1100);
      }, 900);
    });
  }

  /* ---------- SIGNUP ---------- */
  function initSignup() {
    const form = document.getElementById("signupForm");
    if (!form) return;

    form.addEventListener("input", (e) => {
      if (e.target.matches("[data-rules]")) SL.validateInput(e.target);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!SL.validateForm(form)) {
        SL.toast("Please review the form", "Some fields need your attention.", "error");
        return;
      }
      const btn = form.querySelector('[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = "Creating account...";

      setTimeout(() => {
        const email = document.getElementById("signupEmail").value.trim().toLowerCase();
        const users = getUsers();
        if (users.some((u) => u.email === email)) {
          btn.disabled = false;
          btn.innerHTML = original;
          SL.setFieldError(document.getElementById("signupEmail"), "An account with this email already exists. Try logging in.");
          SL.toast("Account exists", "Please log in instead.", "error");
          return;
        }
        users.push({
          name: document.getElementById("signupName").value.trim(),
          email: email,
          phone: document.getElementById("signupPhone").value.trim(),
          password: document.getElementById("signupPassword").value,
          role: document.getElementById("signupRole")?.value || "parent",
          createdAt: Date.now(),
        });
        saveUsers(users);
        SL.toast("Account created!", "Redirecting you to the login page...");
        // Signup NEVER goes straight to the dashboard.
        setTimeout(() => window.location.href = "login.html", 1300);
      }, 950);
    });
  }

  /* ---------- Google (demo notice only) ---------- */
  function initGoogle() {
    SL.qsa("[data-google]").forEach((btn) => {
      btn.addEventListener("click", () => { window.location.href = "404.html"; });
    });
  }

  /* ---------- Logout confirmation modal ---------- */
  function initLogout() {
    const triggers = SL.qsa("[data-logout]");
    if (!triggers.length) return;
    triggers.forEach((t) =>
      t.addEventListener("click", (e) => {
        e.preventDefault();
        SL.modal.open(
          '<div class="modal-head"><h3>Confirm logout</h3>' +
            '<button class="modal-close" data-modal-close aria-label="Close">&times;</button></div>' +
            '<div class="modal-body center">' +
            '<div class="success-check" style="background:#fff3d9;color:#b8791a">\u26A1</div>' +
            "<h3>Are you sure you want to logout?</h3>" +
            '<p class="muted mt-1">You will be returned to the login page.</p></div>' +
            '<div class="modal-foot">' +
            '<button class="btn btn-soft" data-modal-close>Cancel</button>' +
            '<button class="btn btn-danger" id="confirmLogout">Confirm Logout</button></div>'
        );
        const confirmBtn = document.getElementById("confirmLogout");
        if (confirmBtn) {
          confirmBtn.addEventListener("click", () => {
            SL.modal.close();
            SL.session.clear();
            SL.toast("Logged out", "See you again soon!");
            setTimeout(() => window.location.replace("login.html"), 700);
          });
        }
      })
    );
  }

  /* ---------- Session guard + user binding ---------- */
  function guard() {
    const body = document.body;
    if (body.hasAttribute("data-protected") && !SL.session.requireAuth()) return;
  }

  function bindUser() {
    const session = SL.session.get();
    if (!session) return;
    SL.qsa("[data-user-email]").forEach((el) => (el.textContent = session.email));
    SL.qsa("[data-user-name]").forEach((el) => (el.textContent = session.username));
    SL.qsa("[data-user-greeting]").forEach((el) => (el.textContent = "Welcome back, " + session.username + "!"));
    SL.qsa("[data-user-initials]").forEach((el) => (el.textContent = session.initials));
    SL.qsa("[data-user-avatar]").forEach((el) => {
      el.src = "https://i.pravatar.cc/80?u=" + encodeURIComponent(session.email);
    });
    SL.qsa("[data-user-first]").forEach((el) => {
      const u = session.username.replace(/[._-]/g, " ");
      el.textContent = u.charAt(0).toUpperCase() + u.slice(1);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPwToggles();
    initStrength();
    initRoleSwitches();
    initLogin();
    initSignup();
    initGoogle();
    initLogout();
    bindUser();
  });

  // Session guard runs immediately (auth.js is loaded at the end of <body>)
  // so protected pages redirect before dashboard content is shown.
  guard();
})();
