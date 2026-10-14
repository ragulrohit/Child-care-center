/* ============================================================
   STACKLY — dropdowns.js
   Custom dropdown positioning, outside-click + Escape closing,
   viewport-aware flip, single-open behaviour.
   ============================================================ */
(function () {
  "use strict";

  function closeAll(except) {
    document.querySelectorAll(".dd.open").forEach((dd) => {
      if (dd !== except) {
        dd.classList.remove("open");
        const btn = dd.querySelector("[data-dd-toggle]");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function positionMenu(dd) {
    const menu = dd.querySelector(".dd-menu");
    const btn = dd.querySelector("[data-dd-toggle]");
    if (!menu || !btn) return;
    // reset
    menu.style.top = "";
    menu.style.bottom = "";
    menu.style.maxHeight = "";
    const rect = btn.getBoundingClientRect();
    const menuH = menu.offsetHeight;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    // Flip upward only when there is genuinely more room above.
    if (spaceBelow < menuH + 16 && spaceAbove > spaceBelow) {
      menu.style.top = "auto";
      menu.style.bottom = "calc(100% + 8px)";
      menu.style.transformOrigin = "bottom";
    } else {
      menu.style.top = "calc(100% + 8px)";
      menu.style.bottom = "auto";
      menu.style.transformOrigin = "top";
    }
    // Keep within viewport height
    const maxH = Math.max(180, (spaceBelow > spaceAbove ? spaceBelow : spaceAbove) - 24);
    menu.style.maxHeight = Math.min(420, maxH) + "px";
    menu.style.overflowY = "auto";
  }

  function init() {
    document.querySelectorAll(".dd").forEach((dd) => {
      const btn = dd.querySelector("[data-dd-toggle]");
      if (!btn) return;
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-haspopup", "true");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const willOpen = !dd.classList.contains("open");
        closeAll(dd);
        dd.classList.toggle("open", willOpen);
        btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
        if (willOpen) positionMenu(dd);
      });
      // Close on item selection (unless item opts out with data-dd-keep)
      dd.querySelectorAll(".dd-item").forEach((item) => {
        item.addEventListener("click", () => {
          if (item.hasAttribute("data-dd-keep")) return;
          closeAll();
        });
      });
    });

    initCustomSelects();
    new MutationObserver(initCustomSelects).observe(document.body, { childList: true, subtree: true });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".dd")) closeAll();
      if (!e.target.closest(".custom-select")) closeCustomSelects();
    });
    document.addEventListener("pointerdown", (e) => {
      if (!e.target.closest(".custom-select")) closeCustomSelects();
    }, true);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });
    window.addEventListener("resize", () => {
      document.querySelectorAll(".dd.open").forEach(positionMenu);
    });
    window.addEventListener("scroll", () => {
      closeAll();
    }, { passive: true });
  }

  function closeCustomSelects() {
    document.querySelectorAll(".custom-select.open").forEach((wrap) => {
      wrap.classList.remove("open", "flip");
      const button = wrap.querySelector(".custom-select-button");
      if (button) button.setAttribute("aria-expanded", "false");
    });
  }

  function initCustomSelects() {
    document.querySelectorAll("select:not([data-customized])").forEach((select) => {
      select.dataset.customized = "true";
      const wrap = document.createElement("div");
      wrap.className = "custom-select";
      select.parentNode.insertBefore(wrap, select);
      wrap.appendChild(select);
      select.classList.add("custom-select-native");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "custom-select-button";
      button.setAttribute("aria-haspopup", "listbox");
      button.setAttribute("aria-expanded", "false");
      wrap.appendChild(button);
      const menu = document.createElement("div");
      menu.className = "custom-select-menu";
      menu.setAttribute("role", "listbox");
      wrap.appendChild(menu);
      const update = () => {
        const selected = select.options[select.selectedIndex];
        button.textContent = selected ? selected.textContent : "Select an option";
        menu.querySelectorAll("[role=option]").forEach((item) => item.classList.toggle("selected", item.dataset.value === select.value));
      };
      Array.from(select.options).forEach((option) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "custom-select-option";
        item.setAttribute("role", "option");
        item.dataset.value = option.value;
        item.textContent = option.textContent;
        item.addEventListener("click", () => {
          select.value = option.value;
          select.dispatchEvent(new Event("input", { bubbles: true }));
          select.dispatchEvent(new Event("change", { bubbles: true }));
          update();
          closeCustomSelects();
        });
        menu.appendChild(item);
      });
      update();
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const opening = !wrap.classList.contains("open");
        closeCustomSelects();
        if (opening) {
          wrap.classList.add("open");
          button.setAttribute("aria-expanded", "true");
        }
      });
      select.addEventListener("change", update);
    });
  }

  document.addEventListener("DOMContentLoaded", () => setTimeout(init, 0));
  window.SLDropdowns = { closeAll: closeAll, positionMenu: positionMenu };
})();
