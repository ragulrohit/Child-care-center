/* ============================================================
   STACKLY — dashboard.js
   Sidebar behaviour, sample data, CRUD modals, filters,
   tables, CSV export, settings. Demonstration data only.
   ============================================================ */
(function () {
  "use strict";
  const SL = (window.SL = window.SL || {});
  const qs = (s, c) => (c || document).querySelector(s);
  const qsa = (s, c) => Array.from((c || document).querySelectorAll(s));
  const IMG = (seed) => "https://i.pravatar.cc/120?img=" + seed;

  /* ---------------- Sample data ---------------- */
  const DB = {
    children: [
      { id: 1, name: "Aarav Sharma", age: "Toddler", group: "Toddler", program: "Toddler Care", enrolled: "2025-04-12", status: "Present", img: IMG(11) },
      { id: 2, name: "Mia Fernandes", age: "Infant", group: "Infants", program: "Infant Care", enrolled: "2025-06-02", status: "Present", img: IMG(5) },
      { id: 3, name: "Noah Patel", age: "Preschool", group: "Preschool", program: "Preschool", enrolled: "2024-09-18", status: "Absent", img: IMG(12) },
      { id: 4, name: "Sara Khan", age: "After-School", group: "After-School", program: "After-School Care", enrolled: "2025-01-22", status: "Late", img: IMG(9) },
      { id: 5, name: "Liam Dsouza", age: "Toddler", group: "Toddler", program: "Early Learning", enrolled: "2025-03-08", status: "Present", img: IMG(15) },
      { id: 6, name: "Anaya Rathi", age: "Preschool", group: "Preschool", program: "Creative Activities", enrolled: "2024-11-30", status: "Present", img: IMG(20) },
    ],
    staff: [
      { id: 1, name: "Priya Menon", role: "Lead Teacher", email: "priya.menon@stackly.com", exp: "8 yrs", room: "Sunflower Room", avail: "Available", img: IMG(45) },
      { id: 2, name: "Daniel Coates", role: "Caregiver", email: "daniel.c@stackly.com", exp: "5 yrs", room: "Tulip Room", avail: "On Duty", img: IMG(13) },
      { id: 3, name: "Grace Osei", role: "Child Psychologist", email: "grace.o@stackly.com", exp: "11 yrs", room: "All Rooms", avail: "Available", img: IMG(32) },
      { id: 4, name: "Rahul Verma", role: "Assistant Teacher", email: "rahul.v@stackly.com", exp: "3 yrs", room: "Daisy Room", avail: "On Leave", img: IMG(14) },
    ],
    programs: [
      { id: 1, name: "Infant Care", age: "6 wks - 12 mo", enrolled: 12, teachers: ["Priya", "Grace"], avail: "Open", img: "infant" },
      { id: 2, name: "Toddler Care", age: "1 - 3 yrs", enrolled: 18, teachers: ["Daniel", "Rahul"], avail: "Open", img: "toddler" },
      { id: 3, name: "Preschool", age: "3 - 5 yrs", enrolled: 24, teachers: ["Priya"], avail: "Few seats", img: "preschool" },
      { id: 4, name: "Early Learning", age: "2 - 4 yrs", enrolled: 15, teachers: ["Grace"], avail: "Open", img: "early" },
      { id: 5, name: "After-School Care", age: "5 - 10 yrs", enrolled: 20, teachers: ["Rahul"], avail: "Waitlist", img: "after" },
      { id: 6, name: "Creative Activities", age: "3 - 8 yrs", enrolled: 16, teachers: ["Daniel"], avail: "Open", img: "creative" },
    ],
    attendance: [
      { child: "Aarav Sharma", room: "Sunflower Room", time: "08:42", status: "Present" },
      { child: "Mia Fernandes", room: "Tulip Room", time: "08:55", status: "Present" },
      { child: "Noah Patel", room: "Daisy Room", time: "\u2014", status: "Absent" },
      { child: "Sara Khan", room: "Sunflower Room", time: "09:26", status: "Late" },
      { child: "Liam Dsouza", room: "Tulip Room", time: "08:38", status: "Present" },
      { child: "Anaya Rathi", room: "Daisy Room", time: "08:50", status: "Present" },
    ],
    activities: [
      { id: 1, title: "Finger Painting Fun", cat: "Arts & Crafts", date: "2026-10-14", time: "10:00 AM", caregiver: "Daniel Coates", age: "2 - 4 yrs", img: "art" },
      { id: 2, title: "The Enchanted Story Circle", cat: "Story Time", date: "2026-10-14", time: "11:30 AM", caregiver: "Priya Menon", age: "3 - 5 yrs", img: "story" },
      { id: 3, title: "Sunshine Outdoor Play", cat: "Outdoor Play", date: "2026-10-15", time: "09:00 AM", caregiver: "Rahul Verma", age: "4 - 8 yrs", img: "play" },
      { id: 4, title: "Rhythm & Rhyme Dance", cat: "Music & Dance", date: "2026-10-15", time: "02:00 PM", caregiver: "Grace Osei", age: "2 - 5 yrs", img: "music" },
      { id: 5, title: "Little Scientists Lab", cat: "Early Learning", date: "2026-10-16", time: "10:30 AM", caregiver: "Priya Menon", age: "4 - 7 yrs", img: "learn" },
      { id: 6, title: "Sensory Sand & Water", cat: "Sensory Activities", date: "2026-10-16", time: "01:00 PM", caregiver: "Daniel Coates", age: "1 - 3 yrs", img: "sensory" },
    ],
  };

  /* ---------------- Shared chrome (sidebar + header) ---------------- */
  const NAV = [
    { href: "dashboard.html", label: "Overview", icon: '<path d="M3 13h8V3H3zM13 21h8V3h-8zM3 21h8v-6H3z"/>' },
    { href: "children.html", label: "Children", icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>' },
    { href: "staff.html", label: "Staff", icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>' },
    { href: "dashboard-programs.html", label: "Programs", icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>' },
    { href: "attendance.html", label: "Attendance", icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>' },
    { href: "activities.html", label: "Activities", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>' },
    { href: "reports.html", label: "Reports", icon: '<path d="M18 20V10M12 20V4M6 20v-6"/>' },
    { href: "settings.html", label: "Settings", icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
  ];

  function svg(paths) {
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + "</svg>";
  }

  function renderChrome() {
    const side = qs("#appSidebar");
    if (side) {
      side.innerHTML =
        '<div class="sidebar-head"><a href="index.html" class="logo" aria-label="STACKLY home"><img class="brand-logo-img" src="../images/Stackly_logo_clean.png" alt="STACKLY"></a><button class="sidebar-close" data-sidebar-close aria-label="Close sidebar">&times;</button></div>' +
        '<nav class="sidebar-nav"><div class="sidebar-label">Manage</div>' +
        NAV.map((n) => '<a class="side-link" href="' + n.href + '"><span class="ic">' + svg(n.icon) + '</span><span class="lbl">' + n.label + "</span></a>").join("") +
        '</nav><div class="sidebar-foot">' +
        '<button class="side-link" data-logout><span class="ic">' + svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>') + '</span><span class="lbl">Logout</span></button>' +
        "</div>";
    }
    const header = qs("#appHeader");
    if (header) {
      header.innerHTML =
        '<button class="hamburger" data-sidebar-toggle aria-label="Open sidebar" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '<div class="dash-search"><span class="ic">' + svg('<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>') + '</span><input id="globalSearch" type="search" placeholder="Search children, staff, activities..." aria-label="Search"></div>' +
        '<div class="header-right">' +
          '<div class="dd"><button class="icon-btn" data-dd-toggle aria-label="Notifications">' + svg('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>') + '<span class="dot-badge"></span></button>' +
            '<div class="dd-menu right notif-panel">' +
              '<div class="dd-head"><strong>Notifications</strong><span class="tag mint">3 new</span></div>' +
              '<div class="notif-item"><span class="ni-icon ib-mint">&#10003;</span><div><strong>Aarav arrived</strong><p>Checked in at 8:42 AM</p><small>10 min ago</small></div></div>' +
              '<div class="notif-item"><span class="ni-icon ib-sky">&#127912;</span><div><strong>New activity added</strong><p>Finger Painting — tomorrow 10 AM</p><small>1 hr ago</small></div></div>' +
              '<div class="notif-item"><span class="ni-icon ib-yellow">&#9873;</span><div><strong>Payment reminder</strong><p>Term fee due on the 20th</p><small>Yesterday</small></div></div>' +
            "</div></div>" +
          '<div class="dd"><button class="user-chip" data-dd-toggle aria-label="Profile menu">' +
            '<img data-user-avatar src="https://i.pravatar.cc/80?u=stackly" alt="User avatar">' +
            '<div class="u-meta"><strong data-user-first>User</strong><small data-user-email>user@stackly.com</small></div>' +
            '<span style="color:var(--muted)">&#9662;</span></button>' +
            '<div class="dd-menu right"><a class="dd-item" href="settings.html"><span class="ic">' + svg('<circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>') + '</span> Profile settings</a>' +
            '<button class="dd-item" data-logout><span class="ic">' + svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>') + '</span> Logout</button></div></div>' +
        "</div>";
    }
  }

  /* ---------------- Sidebar ---------------- */
  function initSidebar() {
    const sidebar = qs(".sidebar");
    if (!sidebar) return;
    const burger = qs("[data-sidebar-toggle]");
    const closeButton = qs("[data-sidebar-close]");
    const backdrop = qs(".sidebar-backdrop");
    const isMobile = () => window.matchMedia("(max-width: 900px)").matches;
    const syncBurger = () => {
      if (!burger) return;
      const open = isMobile() ? sidebar.classList.contains("mobile-open") : sidebar.classList.contains("collapsed");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close sidebar" : "Open sidebar");
    };

    if (burger) {
      burger.addEventListener("click", () => {
        if (isMobile()) sidebar.classList.toggle("mobile-open");
        else sidebar.classList.toggle("collapsed");
        if (backdrop) backdrop.classList.toggle("show", sidebar.classList.contains("mobile-open"));
        syncBurger();
      });
    }
    if (backdrop) {
      backdrop.addEventListener("click", () => {
        sidebar.classList.remove("mobile-open");
        backdrop.classList.remove("show");
        syncBurger();
      });
    }
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        sidebar.classList.remove("mobile-open");
        if (backdrop) backdrop.classList.remove("show");
        syncBurger();
      });
    }
    syncBurger();
    // highlight current page
    const page = (location.pathname.split("/").pop() || "dashboard.html").toLowerCase();
    qsa(".side-link").forEach((a) => {
      if ((a.getAttribute("href") || "").toLowerCase() === page) a.classList.add("active");
    });
  }

  /* ---------------- helpers ---------------- */
  function statusPill(status) {
    const map = { Present: "green", Absent: "red", Late: "amber", Available: "green", "On Duty": "blue", "On Leave": "amber", Open: "green", "Few seats": "amber", Waitlist: "gray", Active: "green", Inactive: "gray" };
    return '<span class="pill ' + (map[status] || "gray") + '">' + status + "</span>";
  }
  function initials(name) {
    return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  /* ---------------- Children page ---------------- */
  function renderChildren() {
    const grid = qs("#childrenGrid");
    if (!grid) return;
    const term = (qs("#childSearch") ? qs("#childSearch").value : "").toLowerCase();
    const group = qs("#childGroupFilter") ? qs("#childGroupFilter").value : "all";
    const status = qs("#childStatusFilter") ? qs("#childStatusFilter").value : "all";
    const list = DB.children.filter((c) =>
      c.name.toLowerCase().includes(term) &&
      (group === "all" || c.group === group) &&
      (status === "all" || c.status === status)
    );
    grid.innerHTML = list.length
      ? list.map((c) =>
          '<article class="child-card reveal in" data-id="' + c.id + '">' +
            '<div class="cc-head"><img src="' + c.img + '" alt="' + esc(c.name) + '" loading="lazy">' +
            "<div><strong>" + esc(c.name) + "</strong><small>" + esc(c.program) + "</small></div></div>" +
            '<div class="cc-row"><span>Age group</span><span>' + esc(c.group) + "</span></div>" +
            '<div class="cc-row"><span>Enrolled</span><span>' + c.enrolled + "</span></div>" +
            '<div class="cc-row"><span>Status</span><span>' + statusPill(c.status) + "</span></div>" +
            '<div class="cc-actions">' +
              '<button class="btn btn-soft" data-view-child="' + c.id + '">Details</button>' +
              '<button class="btn" data-edit-child="' + c.id + '">Edit</button>' +
            "</div></article>"
        ).join("")
      : '<div class="panel center" style="grid-column:1/-1"><p class="muted">No children match your filters.</p></div>';

    qsa("[data-view-child]", grid).forEach((b) => b.addEventListener("click", () => viewChild(+b.dataset.viewChild)));
    qsa("[data-edit-child]", grid).forEach((b) => b.addEventListener("click", () => childForm(DB.children.find((c) => c.id === +b.dataset.editChild))));
  }
  function viewChild(id) {
    const c = DB.children.find((x) => x.id === id);
    if (!c) return;
    SL.modal.open(
      '<div class="modal-head"><h3>Child details</h3><button class="modal-close" data-modal-close>&times;</button></div>' +
      '<div class="modal-body"><div class="cell-user" style="margin-bottom:16px"><img src="' + c.img + '" style="width:64px;height:64px;border-radius:16px" alt=""><div><strong>' + esc(c.name) + "</strong><div class=\"muted\">" + esc(c.program) + "</div></div></div>" +
      '<div class="cc-row"><span>Age group</span><span>' + c.group + "</span></div>" +
      '<div class="cc-row"><span>Enrolled</span><span>' + c.enrolled + "</span></div>" +
      '<div class="cc-row"><span>Attendance today</span><span>' + statusPill(c.status) + "</span></div></div>" +
      '<div class="modal-foot"><button class="btn btn-soft" data-modal-close>Close</button></div>'
    );
  }
  function childForm(child) {
    const editing = !!child;
    SL.modal.open(
      '<div class="modal-head"><h3>' + (editing ? "Edit child" : "Add child") + '</h3><button class="modal-close" data-modal-close>&times;</button></div>' +
      '<form class="modal-body" id="childForm">' +
        '<div class="field"><label>Full name <span class="req">*</span></label><input class="input" name="name" data-rules="required|min:2" data-label="Name" value="' + (editing ? esc(child.name) : "") + '"><div class="msg"></div></div>' +
        '<div class="field"><label>Age group <span class="req">*</span></label><select class="select" name="group" data-rules="required" data-label="Age group">' +
          ["Infants","Toddler","Preschool","After-School"].map((g) => '<option' + (editing && child.group === g ? " selected" : "") + ">" + g + "</option>").join("") +
        "</select><div class=\"msg\"></div></div>" +
        '<div class="field"><label>Program</label><input class="input" name="program" value="' + (editing ? esc(child.program) : "Infant Care") + '"><div class="msg"></div></div>' +
        '<div class="field"><label>Enrollment date</label><input class="input" type="date" name="enrolled" value="' + (editing ? child.enrolled : "") + '"><div class="msg"></div></div>' +
      "</form>" +
      '<div class="modal-foot"><button class="btn btn-soft" data-modal-close>Cancel</button><button class="btn" id="saveChild">' + (editing ? "Save changes" : "Add child") + "</button></div>"
    );
    const form = qs("#childForm");
    form.addEventListener("input", (e) => { if (e.target.matches("[data-rules]")) SL.validateInput(e.target); });
    qs("#saveChild").addEventListener("click", () => {
      if (!SL.validateForm(form)) return;
      const data = Object.fromEntries(new FormData(form).entries());
      if (editing) Object.assign(child, data);
      else DB.children.unshift({ id: Date.now(), name: data.name, age: data.group, group: data.group, program: data.program, enrolled: data.enrolled || new Date().toISOString().slice(0, 10), status: "Present", img: "https://i.pravatar.cc/120?u=" + Date.now() });
      SL.modal.close();
      renderChildren();
      SL.toast(editing ? "Child updated" : "Child added", data.name + " has been saved.");
    });
  }
  function initChildren() {
    if (!qs("#childrenGrid")) return;
    ["#childSearch", "#childGroupFilter", "#childStatusFilter"].forEach((s) => {
      const el = qs(s);
      if (el) el.addEventListener("input", renderChildren);
    });
    const add = qs("#addChildBtn");
    if (add) add.addEventListener("click", () => childForm(null));
    renderChildren();
  }

  /* ---------------- Staff page ---------------- */
  function renderStaff() {
    const tbody = qs("#staffBody");
    if (!tbody) return;
    const term = (qs("#staffSearch") ? qs("#staffSearch").value : "").toLowerCase();
    const role = qs("#staffRoleFilter") ? qs("#staffRoleFilter").value : "all";
    const list = DB.staff.filter((s) => (s.name.toLowerCase().includes(term) || s.email.includes(term)) && (role === "all" || s.role === role));
    tbody.innerHTML = list.length
      ? list.map((s) =>
          "<tr>" +
            '<td><div class="cell-user"><img src="' + s.img + '" alt="' + esc(s.name) + '" loading="lazy"><div><strong>' + esc(s.name) + "</strong><br><small class=\"muted\">" + esc(s.email) + "</small></div></div></td>" +
            "<td>" + esc(s.role) + "</td><td>" + s.exp + "</td><td>" + esc(s.room) + "</td>" +
            "<td>" + statusPill(s.avail) + "</td>" +
            '<td><button class="btn btn-soft btn-sm" data-view-staff="' + s.id + '">View</button> <button class="btn btn-sm" data-edit-staff="' + s.id + '">Edit</button></td>' +
          "</tr>"
        ).join("")
      : '<tr><td colspan="6" class="center muted" style="padding:30px">No staff match your filters.</td></tr>';
    qsa("[data-view-staff]", tbody).forEach((b) => b.addEventListener("click", () => {
      const s = DB.staff.find((x) => x.id === +b.dataset.viewStaff);
      SL.modal.open(
        '<div class="modal-head"><h3>Staff profile</h3><button class="modal-close" data-modal-close>&times;</button></div>' +
        '<div class="modal-body"><div class="cell-user" style="margin-bottom:16px"><img src="' + s.img + '" style="width:64px;height:64px;border-radius:16px" alt=""><div><strong>' + esc(s.name) + "</strong><div class=\"muted\">" + esc(s.role) + "</div></div></div>" +
        '<div class="cc-row"><span>Email</span><span>' + esc(s.email) + "</span></div>" +
        '<div class="cc-row"><span>Experience</span><span>' + s.exp + "</span></div>" +
        '<div class="cc-row"><span>Classroom</span><span>' + esc(s.room) + "</span></div>" +
        '<div class="cc-row"><span>Availability</span><span>' + statusPill(s.avail) + "</span></div></div>" +
        '<div class="modal-foot"><button class="btn btn-soft" data-modal-close>Close</button></div>'
      );
    }));
    qsa("[data-edit-staff]", tbody).forEach((b) => b.addEventListener("click", () => staffForm(DB.staff.find((x) => x.id === +b.dataset.editStaff))));
  }
  function staffForm(staff) {
    const editing = !!staff;
    SL.modal.open(
      '<div class="modal-head"><h3>' + (editing ? "Edit staff" : "Add staff") + '</h3><button class="modal-close" data-modal-close>&times;</button></div>' +
      '<form class="modal-body" id="staffForm">' +
        '<div class="field"><label>Full name <span class="req">*</span></label><input class="input" name="name" data-rules="required|min:2" data-label="Name" value="' + (editing ? esc(staff.name) : "") + '"><div class="msg"></div></div>' +
        '<div class="field"><label>Role <span class="req">*</span></label><select class="select" name="role" data-rules="required" data-label="Role">' +
          ["Lead Teacher","Assistant Teacher","Caregiver","Child Psychologist","Administrator"].map((r) => '<option' + (editing && staff.role === r ? " selected" : "") + ">" + r + "</option>").join("") +
        "</select><div class=\"msg\"></div></div>" +
        '<div class="field"><label>Email <span class="req">*</span></label><input class="input" name="email" data-rules="required|email" data-label="Email" value="' + (editing ? esc(staff.email) : "") + '"><div class="msg"></div></div>' +
        '<div class="field"><label>Experience</label><input class="input" name="exp" value="' + (editing ? esc(staff.exp) : "") + '" placeholder="e.g. 4 yrs"><div class="msg"></div></div>' +
        '<div class="field"><label>Classroom</label><input class="input" name="room" value="' + (editing ? esc(staff.room) : "") + '" placeholder="e.g. Sunflower Room"><div class="msg"></div></div>' +
      "</form>" +
      '<div class="modal-foot"><button class="btn btn-soft" data-modal-close>Cancel</button><button class="btn" id="saveStaff">' + (editing ? "Save changes" : "Add staff") + "</button></div>"
    );
    const form = qs("#staffForm");
    form.addEventListener("input", (e) => { if (e.target.matches("[data-rules]")) SL.validateInput(e.target); });
    qs("#saveStaff").addEventListener("click", () => {
      if (!SL.validateForm(form)) return;
      const data = Object.fromEntries(new FormData(form).entries());
      if (editing) Object.assign(staff, data);
      else DB.staff.unshift({ id: Date.now(), name: data.name, role: data.role, email: data.email, exp: data.exp || "New", room: data.room || "Unassigned", avail: "Available", img: "https://i.pravatar.cc/120?u=" + Date.now() });
      SL.modal.close();
      renderStaff();
      SL.toast(editing ? "Staff updated" : "Staff added", data.name + " has been saved.");
    });
  }
  function initStaff() {
    if (!qs("#staffBody")) return;
    ["#staffSearch", "#staffRoleFilter"].forEach((s) => { const el = qs(s); if (el) el.addEventListener("input", renderStaff); });
    const add = qs("#addStaffBtn");
    if (add) add.addEventListener("click", () => staffForm(null));
    renderStaff();
  }

  /* ---------------- Dashboard programs ---------------- */
  const progImg = {
    infant: "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=70",
    toddler: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=70",
    preschool: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=70",
    early: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=70",
    after: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=70",
    creative: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=70",
  };
  function renderPrograms() {
    const grid = qs("#progGrid");
    if (!grid) return;
    const term = (qs("#progSearch") ? qs("#progSearch").value : "").toLowerCase();
    const cat = qs("#progCatFilter") ? qs("#progCatFilter").value : "all";
    const list = DB.programs.filter((p) => p.name.toLowerCase().includes(term) && (cat === "all" || p.age.toLowerCase().includes(cat) || p.name.toLowerCase().includes(cat)));
    grid.innerHTML = list.length
      ? list.map((p) =>
          '<article class="card reveal in">' +
            '<div class="card-media"><img src="' + (progImg[p.img] || progImg.toddler) + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
            '<div class="card-body"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h3>' + esc(p.name) + "</h3>" + statusPill(p.avail) + "</div>" +
            '<p class="muted" style="font-size:.85rem">Ages ' + esc(p.age) + " \u00B7 " + p.enrolled + " enrolled</p>" +
            '<p style="margin-top:8px">Teachers: ' + p.teachers.map(esc).join(", ") + "</p>" +
            '<div class="card-actions"><button class="btn btn-soft btn-sm" data-edit-prog="' + p.id + '">Edit</button>' +
            '<button class="btn btn-danger btn-sm" data-del-prog="' + p.id + '">Delete</button></div></div></article>'
        ).join("")
      : '<div class="panel center" style="grid-column:1/-1"><p class="muted">No programs match your filters.</p></div>';
    qsa("[data-edit-prog]", grid).forEach((b) => b.addEventListener("click", () => programForm(DB.programs.find((p) => p.id === +b.dataset.editProg))));
    qsa("[data-del-prog]", grid).forEach((b) => b.addEventListener("click", () => confirmDeleteProgram(+b.dataset.delProg)));
  }
  function confirmDeleteProgram(id) {
    const p = DB.programs.find((x) => x.id === id);
    if (!p) return;
    SL.modal.open(
      '<div class="modal-head"><h3>Delete program</h3><button class="modal-close" data-modal-close>&times;</button></div>' +
      '<div class="modal-body center"><div class="success-check" style="background:#ffe6e9;color:#e0394d">!</div>' +
      "<h3>Delete \"" + esc(p.name) + "\"?</h3><p class=\"muted mt-1\">This action cannot be undone.</p></div>" +
      '<div class="modal-foot"><button class="btn btn-soft" data-modal-close>Cancel</button><button class="btn btn-danger" id="confirmDelProg">Delete</button></div>'
    );
    qs("#confirmDelProg").addEventListener("click", () => {
      DB.programs = DB.programs.filter((x) => x.id !== id);
      SL.modal.close();
      renderPrograms();
      SL.toast("Program deleted", p.name + " has been removed.");
    });
  }
  function programForm(prog) {
    const editing = !!prog;
    SL.modal.open(
      '<div class="modal-head"><h3>' + (editing ? "Edit program" : "Add program") + '</h3><button class="modal-close" data-modal-close>&times;</button></div>' +
      '<form class="modal-body" id="progForm">' +
        '<div class="field"><label>Program name <span class="req">*</span></label><input class="input" name="name" data-rules="required|min:2" data-label="Program name" value="' + (editing ? esc(prog.name) : "") + '"><div class="msg"></div></div>' +
        '<div class="field"><label>Age group <span class="req">*</span></label><input class="input" name="age" data-rules="required" data-label="Age group" value="' + (editing ? esc(prog.age) : "") + '" placeholder="e.g. 2 - 4 yrs"><div class="msg"></div></div>' +
        '<div class="field"><label>Enrolled count</label><input class="input" type="number" name="enrolled" value="' + (editing ? prog.enrolled : "0") + '"><div class="msg"></div></div>' +
        '<div class="field"><label>Availability <span class="req">*</span></label><select class="select" name="avail" data-rules="required" data-label="Availability">' +
          ["Open","Few seats","Waitlist","Closed"].map((a) => '<option' + (editing && prog.avail === a ? " selected" : "") + ">" + a + "</option>").join("") +
        "</select><div class=\"msg\"></div></div>" +
      "</form>" +
      '<div class="modal-foot"><button class="btn btn-soft" data-modal-close>Cancel</button><button class="btn" id="saveProg">' + (editing ? "Save changes" : "Add program") + "</button></div>"
    );
    const form = qs("#progForm");
    form.addEventListener("input", (e) => { if (e.target.matches("[data-rules]")) SL.validateInput(e.target); });
    qs("#saveProg").addEventListener("click", () => {
      if (!SL.validateForm(form)) return;
      const data = Object.fromEntries(new FormData(form).entries());
      if (editing) { Object.assign(prog, { name: data.name, age: data.age, enrolled: +data.enrolled, avail: data.avail }); }
      else DB.programs.unshift({ id: Date.now(), name: data.name, age: data.age, enrolled: +data.enrolled || 0, teachers: ["Unassigned"], avail: data.avail, img: "toddler" });
      SL.modal.close();
      renderPrograms();
      SL.toast(editing ? "Program updated" : "Program added", data.name + " has been saved.");
    });
  }
  function initDashPrograms() {
    if (!qs("#progGrid")) return;
    ["#progSearch", "#progCatFilter"].forEach((s) => { const el = qs(s); if (el) el.addEventListener("input", renderPrograms); });
    const add = qs("#addProgBtn");
    if (add) add.addEventListener("click", () => programForm(null));
    renderPrograms();
  }

  /* ---------------- Attendance ---------------- */
  function getAttendance() {
    if (!DB._att) DB._att = DB.attendance.map((a) => Object.assign({}, a));
    return DB._att;
  }
  function renderAttendance() {
    const tbody = qs("#attBody");
    if (!tbody) return;
    const term = (qs("#attSearch") ? qs("#attSearch").value : "").toLowerCase();
    const room = qs("#attRoom") ? qs("#attRoom").value : "all";
    const list = getAttendance().filter((r) => r.child.toLowerCase().includes(term) && (room === "all" || r.room === room));
    tbody.innerHTML = list.length
      ? list.map((r, i) =>
          "<tr>" +
            '<td><div class="cell-user"><img src="https://i.pravatar.cc/80?u=' + encodeURIComponent(r.child) + '" alt="" loading="lazy"><strong>' + esc(r.child) + "</strong></div></td>" +
            "<td>" + esc(r.room) + "</td><td>" + r.time + "</td>" +
            '<td><select class="select mini" data-att-status="' + i + '" style="padding:6px 30px 6px 10px">' +
              ["Present","Absent","Late"].map((s) => '<option' + (r.status === s ? " selected" : "") + ">" + s + "</option>").join("") +
            "</select></td>" +
          "</tr>"
        ).join("")
      : '<tr><td colspan="4" class="center muted" style="padding:30px">No records found.</td></tr>';

    qsa("[data-att-status]").forEach((sel) =>
      sel.addEventListener("change", (e) => {
        const i = +e.target.dataset.attStatus;
        const visible = list[i];
        const rec = getAttendance().find((x) => x.child === visible.child);
        if (rec) rec.status = e.target.value;
        updateAttSummary();
        SL.toast("Attendance updated", visible.child + " marked " + e.target.value + ".");
      })
    );
    updateAttSummary();
  }
  function updateAttSummary() {
    const list = getAttendance();
    const total = list.length;
    const present = list.filter((r) => r.status === "Present").length;
    const absent = list.filter((r) => r.status === "Absent").length;
    const late = list.filter((r) => r.status === "Late").length;
    const pct = total ? Math.round(((present + late) / total) * 100) : 0;
    const set = (id, v) => { const el = qs(id); if (el) el.textContent = v; };
    set("[data-att-present]", present);
    set("[data-att-absent]", absent);
    set("[data-att-late]", late);
    set("[data-att-pct]", pct + "%");
    qsa("[data-att-bar]").forEach((b) => (b.style.width = pct + "%"));
  }
  function initAttendance() {
    if (!qs("#attBody")) return;
    ["#attSearch", "#attRoom", "#attDate"].forEach((s) => { const el = qs(s); if (el) el.addEventListener("input", renderAttendance); });
    const mark = qs("#markAttBtn");
    if (mark) mark.addEventListener("click", () => SL.toast("Attendance saved", "Today's attendance has been recorded."));
    const csv = qs("#exportAttCsv");
    if (csv) csv.addEventListener("click", () => {
      let out = "Child,Classroom,Time,Status\n";
      getAttendance().forEach((r) => (out += [r.child, r.room, r.time, r.status].join(",") + "\n"));
      downloadCsv(out, "stackly-attendance.csv");
      SL.toast("Exported", "Attendance CSV downloaded.");
    });
    renderAttendance();
  }

  function downloadCsv(text, filename) {
    const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  SL.downloadCsv = downloadCsv;

  /* ---------------- Activities ---------------- */
  const actImg = {
    art: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=70",
    story: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=70",
    play: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=70",
    music: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=70",
    learn: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=70",
    sensory: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=70",
  };
  function renderActivities() {
    const grid = qs("#activityGrid");
    if (!grid) return;
    const cat = qs("#actCatFilter") ? qs("#actCatFilter").value : "all";
    const list = DB.activities.filter((a) => cat === "all" || a.cat === cat);
    grid.innerHTML = list.map((a) =>
      '<article class="card reveal in"><div class="card-media"><img src="' + (actImg[a.img] || actImg.art) + '" alt="' + esc(a.title) + '" loading="lazy"></div>' +
      '<div class="card-body"><span class="tag">' + esc(a.cat) + "</span><h3 style=\"margin-top:10px\">" + esc(a.title) + "</h3>" +
      '<p class="muted" style="font-size:.86rem">' + a.date + " \u00B7 " + a.time + "</p>" +
      '<div class="cc-row"><span>Caregiver</span><span>' + esc(a.caregiver) + "</span></div>" +
      '<div class="cc-row"><span>Age group</span><span>' + esc(a.age) + "</span></div>" +
      '<div class="card-actions"><button class="btn btn-soft btn-sm" data-edit-act="' + a.id + '">Edit</button>' +
      '<button class="btn btn-danger btn-sm" data-del-act="' + a.id + '">Delete</button></div></div></article>'
    ).join("");
    qsa("[data-edit-act]", grid).forEach((b) => b.addEventListener("click", () => activityForm(DB.activities.find((x) => x.id === +b.dataset.editAct))));
    qsa("[data-del-act]", grid).forEach((b) => b.addEventListener("click", () => {
      const a = DB.activities.find((x) => x.id === +b.dataset.delAct);
      SL.modal.open(
        '<div class="modal-head"><h3>Delete activity</h3><button class="modal-close" data-modal-close>&times;</button></div>' +
        '<div class="modal-body center"><div class="success-check" style="background:#ffe6e9;color:#e0394d">!</div><h3>Delete "' + esc(a.title) + '"?</h3></div>' +
        '<div class="modal-foot"><button class="btn btn-soft" data-modal-close>Cancel</button><button class="btn btn-danger" id="confirmDelAct">Delete</button></div>'
      );
      qs("#confirmDelAct").addEventListener("click", () => {
        DB.activities = DB.activities.filter((x) => x.id !== a.id);
        SL.modal.close(); renderActivities(); SL.toast("Activity deleted", a.title + " removed.");
      });
    }));
    renderScheduleStrip();
  }
  function renderScheduleStrip() {
    const strip = qs("#calStrip");
    if (!strip) return;
    const names = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    strip.innerHTML = names.map((n, i) => '<button class="cal-day' + (i === 1 ? " active" : "") + '" data-day="' + i + '"><small>' + n + '</small><strong>' + (13 + i) + "</strong></button>").join("");
    qsa(".cal-day", strip).forEach((d) => d.addEventListener("click", () => {
      qsa(".cal-day", strip).forEach((x) => x.classList.remove("active"));
      d.classList.add("active");
    }));
  }
  function activityForm(act) {
    const editing = !!act;
    const cats = ["Arts & Crafts","Story Time","Outdoor Play","Music & Dance","Early Learning","Sensory Activities"];
    SL.modal.open(
      '<div class="modal-head"><h3>' + (editing ? "Edit activity" : "Create activity") + '</h3><button class="modal-close" data-modal-close>&times;</button></div>' +
      '<form class="modal-body" id="actForm">' +
        '<div class="field"><label>Title <span class="req">*</span></label><input class="input" name="title" data-rules="required|min:2" data-label="Title" value="' + (editing ? esc(act.title) : "") + '"><div class="msg"></div></div>' +
        '<div class="field"><label>Category <span class="req">*</span></label><select class="select" name="cat" data-rules="required" data-label="Category">' + cats.map((c) => '<option' + (editing && act.cat === c ? " selected" : "") + ">" + c + "</option>").join("") + "</select><div class=\"msg\"></div></div>" +
        '<div class="field"><label>Date <span class="req">*</span></label><input class="input" type="date" name="date" data-rules="required" data-label="Date" value="' + (editing ? act.date : "") + '"><div class="msg"></div></div>' +
        '<div class="field"><label>Time <span class="req">*</span></label><input class="input" name="time" data-rules="required" data-label="Time" value="' + (editing ? esc(act.time) : "") + '" placeholder="e.g. 10:00 AM"><div class="msg"></div></div>' +
        '<div class="field"><label>Caregiver <span class="req">*</span></label><input class="input" name="caregiver" data-rules="required" data-label="Caregiver" value="' + (editing ? esc(act.caregiver) : "") + '"><div class="msg"></div></div>' +
        '<div class="field"><label>Age group</label><input class="input" name="age" value="' + (editing ? esc(act.age) : "") + '" placeholder="e.g. 2 - 4 yrs"><div class="msg"></div></div>' +
      "</form>" +
      '<div class="modal-foot"><button class="btn btn-soft" data-modal-close>Cancel</button><button class="btn" id="saveAct">' + (editing ? "Save changes" : "Create activity") + "</button></div>"
    );
    const form = qs("#actForm");
    form.addEventListener("input", (e) => { if (e.target.matches("[data-rules]")) SL.validateInput(e.target); });
    qs("#saveAct").addEventListener("click", () => {
      if (!SL.validateForm(form)) return;
      const data = Object.fromEntries(new FormData(form).entries());
      if (editing) Object.assign(act, data);
      else DB.activities.unshift({ id: Date.now(), title: data.title, cat: data.cat, date: data.date, time: data.time, caregiver: data.caregiver, age: data.age || "All ages", img: "art" });
      SL.modal.close(); renderActivities();
      SL.toast(editing ? "Activity updated" : "Activity created", data.title + " saved.");
    });
  }
  function initActivities() {
    if (!qs("#activityGrid")) return;
    const f = qs("#actCatFilter");
    if (f) f.addEventListener("input", renderActivities);
    const add = qs("#addActBtn");
    if (add) add.addEventListener("click", () => activityForm(null));
    renderActivities();
  }

  /* ---------------- Settings ---------------- */
  function initSettings() {
    const nav = qs(".settings-nav");
    if (!nav) return;
    qsa("button", nav).forEach((btn) => {
      btn.addEventListener("click", () => {
        qsa("button", nav).forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        qsa(".settings-pane").forEach((p) => p.classList.remove("active"));
        const pane = qs("#" + btn.dataset.pane);
        if (pane) pane.classList.add("active");
      });
    });
    qsa(".setting-row .switch input").forEach((sw) =>
      sw.addEventListener("change", () => SL.toast("Preference saved", "Your setting was updated."))
    );
    const themeToggle = qs("#themeToggle");
    if (themeToggle) {
      const saved = localStorage.getItem("stackly_theme");
      if (saved === "dark") { document.body.classList.add("dark-theme"); themeToggle.checked = true; }
      themeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-theme", themeToggle.checked);
        localStorage.setItem("stackly_theme", themeToggle.checked ? "dark" : "light");
        SL.toast("Appearance updated", themeToggle.checked ? "Dark theme enabled." : "Light theme enabled.");
      });
    }
  }

  /* ---------------- Charts ---------------- */
  function renderCharts() {
    if (typeof Chart === "undefined") return;
    Chart.defaults.font.family = "Poppins, sans-serif";
    Chart.defaults.color = "#8a8aa0";

    // Overview: age distribution doughnut
    const age = qs("#ageChart");
    if (age) {
      new Chart(age, {
        type: "doughnut",
        data: {
          labels: ["Infants", "Toddlers", "Preschool", "After-School"],
          datasets: [{ data: [12, 18, 24, 20], backgroundColor: ["#7fc8f8", "#ffd166", "#3ecf8e", "#8a6df1"], borderWidth: 0, hoverOffset: 8 }],
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: "62%", plugins: { legend: { position: "bottom", labels: { padding: 16, usePointStyle: true } } } },
      });
    }
    // Overview: weekly attendance line
    const weekly = qs("#weeklyChart");
    if (weekly) {
      new Chart(weekly, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          datasets: [{
            label: "Attendance %",
            data: [92, 88, 95, 90, 87],
            borderColor: "#5a63e8",
            backgroundColor: "rgba(90,99,232,.14)",
            fill: true, tension: .4, pointBackgroundColor: "#5a63e8", pointRadius: 4, borderWidth: 3,
          }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false, min: 60, max: 100, grid: { color: "#f0eef8" } }, x: { grid: { display: false } } } },
      });
    }
    // Reports charts
    const enrollChart = qs("#enrollChart");
    if (enrollChart) {
      new Chart(enrollChart, {
        type: "bar",
        data: { labels: ["Jan","Feb","Mar","Apr","May","Jun"], datasets: [{ label: "Enrollments", data: [14,18,22,19,26,30], backgroundColor: "#7fc8f8", borderRadius: 8 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: "#f0eef8" } }, x: { grid: { display: false } } } },
      });
    }
    const attPie = qs("#attPieChart");
    if (attPie) {
      new Chart(attPie, {
        type: "pie",
        data: { labels: ["Present", "Late", "Absent"], datasets: [{ data: [74, 14, 12], backgroundColor: ["#3ecf8e", "#ffd166", "#ff5c6c"], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { usePointStyle: true, padding: 16 } } } },
      });
    }
    const monthlyTrend = qs("#monthlyTrendChart");
    if (monthlyTrend) {
      new Chart(monthlyTrend, {
        type: "line",
        data: {
          labels: ["Jul","Aug","Sep","Oct","Nov","Dec"],
          datasets: [
            { label: "Attendance %", data: [90, 91, 93, 92, 88, 86], borderColor: "#5a63e8", backgroundColor: "rgba(90,99,232,.12)", fill: true, tension: .4, borderWidth: 3, pointRadius: 4 },
            { label: "Enrollment", data: [60, 64, 68, 72, 70, 74], borderColor: "#3ecf8e", backgroundColor: "transparent", tension: .4, borderWidth: 3, pointRadius: 4 },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { usePointStyle: true, padding: 16 } } }, scales: { y: { grid: { color: "#f0eef8" } }, x: { grid: { display: false } } } },
      });
    }
    const progEnroll = qs("#progEnrollChart");
    if (progEnroll) {
      new Chart(progEnroll, {
        type: "bar",
        data: { labels: ["Infant", "Toddler", "Preschool", "Early", "After-School", "Creative"], datasets: [{ label: "Enrolled", data: [12,18,24,15,20,16], backgroundColor: ["#7fc8f8","#ffd166","#3ecf8e","#8a6df1","#ff9e6d","#5a63e8"], borderRadius: 8 }] },
        options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: "#f0eef8" } }, y: { grid: { display: false } } } },
      });
    }
    const staffChart = qs("#staffChart");
    if (staffChart) {
      new Chart(staffChart, {
        type: "doughnut",
        data: { labels: ["On Duty", "Available", "On Leave"], datasets: [{ data: [8, 5, 2], backgroundColor: ["#5a63e8", "#3ecf8e", "#ffd166"], borderWidth: 0, hoverOffset: 8 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: "62%", plugins: { legend: { position: "bottom", labels: { usePointStyle: true, padding: 14 } } } },
      });
    }
  }

  /* ---------------- Search (header) ---------------- */
  function initHeaderSearch() {
    const input = qs("#globalSearch");
    if (!input) return;
    const trigger = input.parentElement ? input.parentElement.querySelector(".ic") : null;
    const runSearch = () => {
      const term = input.value.trim();
      if (term) SL.toast("Searching", 'Results for "' + term + '" (demo).', "info");
      else input.focus();
    };
    if (trigger) {
      trigger.setAttribute("role", "button");
      trigger.setAttribute("tabindex", "0");
      trigger.setAttribute("aria-label", "Search");
      trigger.addEventListener("click", runSearch);
      trigger.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") runSearch(); });
    }
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runSearch();
    });
  }

  /* ---------------- Reports filters ---------------- */
  function initReports() {
    if (!qs("#reportRange")) return;
    qsa("[data-report-filter]").forEach((btn) =>
      btn.addEventListener("click", () => {
        qsa("[data-report-filter]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        SL.toast("Filter applied", btn.textContent.trim() + " view loaded.", "info");
      })
    );
    const csv = qs("#exportReportCsv");
    if (csv) csv.addEventListener("click", () => {
      downloadCsv("Metric,Value\nTotal Children,74\nActive Staff,15\nAttendance,92%\nPrograms,6\n", "stackly-report.csv");
      SL.toast("Exported", "Report CSV downloaded.");
    });
    const print = qs("#printReport");
    if (print) print.addEventListener("click", () => window.print());
  }

  /* ---------------- Boot ---------------- */
  renderChrome();
  document.addEventListener("DOMContentLoaded", function () {
    initSidebar();
    initChildren();
    initStaff();
    initDashPrograms();
    initAttendance();
    initActivities();
    initSettings();
    initHeaderSearch();
    initReports();
    // charts need Chart.js loaded (defer ensures order)
    renderCharts();
    qsa("img").forEach((i) => { if (i.getAttribute("loading") !== "lazy") i.setAttribute("loading", "lazy"); });
  });
})();
