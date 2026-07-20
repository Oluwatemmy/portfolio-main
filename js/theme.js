/* Theme toggle — dark (default) <-> light.
   Preference order: explicit choice (localStorage) > OS preference > dark.
   The inline script in <body> applies the class before first paint;
   this file wires the toggle buttons (desktop chip + mobile menu row)
   and notifies the background canvas. */
(function () {
  var buttons = document.querySelectorAll("[data-theme-toggle]");
  if (!buttons.length) return;

  function isLight() {
    return document.body.classList.contains("light");
  }

  function syncButtons() {
    var light = isLight();
    buttons.forEach(function (btn) {
      var icon = btn.querySelector("i");
      var label = btn.querySelector(".theme-label");
      /* show the theme the click will switch TO */
      if (icon) icon.className = light ? "fa fa-moon-o" : "fa fa-sun-o";
      if (label) label.textContent = light ? "Dark Mode" : "Light Mode";
    });
  }

  function notify() {
    document.dispatchEvent(new CustomEvent("aotem:theme", { detail: { light: isLight() } }));
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.body.classList.toggle("light");
      try {
        localStorage.setItem("theme", isLight() ? "light" : "dark");
      } catch (e) {}
      syncButtons();
      notify();
    });
  });

  /* follow OS changes only while the user has not chosen explicitly */
  var mq = window.matchMedia("(prefers-color-scheme: light)");
  if (mq.addEventListener) {
    mq.addEventListener("change", function (e) {
      var saved = null;
      try { saved = localStorage.getItem("theme"); } catch (err) {}
      if (saved) return;
      document.body.classList.toggle("light", e.matches);
      syncButtons();
      notify();
    });
  }

  syncButtons();
  notify();
})();
