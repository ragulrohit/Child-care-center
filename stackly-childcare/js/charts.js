/* ============================================================
   STACKLY — charts.js
   Shared Chart.js helpers / palette. Chart instances themselves
   are created in dashboard.js once Chart.js is available.
   ============================================================ */
(function () {
  "use strict";
  const SL = (window.SL = window.SL || {});
  SL.chartPalette = {
    sky: "#7fc8f8",
    yellow: "#ffd166",
    mint: "#3ecf8e",
    lavender: "#8a6df1",
    peach: "#ff9e6d",
    brand: "#5a63e8",
    red: "#ff5c6c",
  };
  SL.chartsReady = function () { return typeof window.Chart !== "undefined"; };
})();
