/* ===================================================================
   PROJECT DATA — to add a project, append an object to this array.
   category: "package" | "api" | "app" | "tool"
   live: null → no Live button is rendered
==================================================================== */
var PROJECTS = [
  {
    name: "Authease",
    desc: "Open-source Django package offering plug-and-play authentication with OAuth, JWT, RBAC and simple login flows. Published on PyPI.",
    stack: ["Python", "Django", "OAuth", "JWT"],
    github: "https://github.com/Oluwatemmy/authease",
    live: "https://pypi.org/project/authease/",
    category: "package",
    featured: true
  },
  {
    name: "GigFlow API",
    desc: "Upwork-style freelancing platform REST API — gigs, proposals, contracts and payments, built with Django.",
    stack: ["Python", "Django", "DRF", "PostgreSQL"],
    github: "https://github.com/Oluwatemmy/gigflow-api",
    live: null,
    category: "api",
    featured: false
  },
  {
    name: "YouTube Downloader Pro",
    desc: "High-performance downloader with an async backend for concurrent downloads, 360p–4K quality selection and real-time progress tracking.",
    stack: ["Python", "FastAPI", "Asyncio", "yt-dlp"],
    github: "https://github.com/Oluwatemmy/Youtube-Downloader",
    live: null,
    category: "tool",
    featured: false
  },
  {
    name: "Student Management API",
    desc: "School management REST API — admin functions, student registration, course creation and a grading system.",
    stack: ["Python", "Flask-RESTX", "PostgreSQL"],
    github: "https://github.com/Oluwatemmy/Student-Management-API",
    live: null,
    category: "api",
    featured: false
  },
  {
    name: "LinkEase",
    desc: "Link-sharing web app with URL shortening and QR code generation.",
    stack: ["Python", "Flask", "Bootstrap"],
    github: "https://github.com/Oluwatemmy/Link-Ease",
    live: null,
    category: "app",
    featured: false
  },
  {
    name: "Invoice Generator",
    desc: "Minimal Flask app for generating clean, printable invoices.",
    stack: ["Python", "Flask"],
    github: "https://github.com/Oluwatemmy/invoice-generator",
    live: null,
    category: "app",
    featured: false
  },
  {
    name: "Authease Blog Demo",
    desc: "Full-featured Django blog built to showcase Authease handling real authentication in a working app.",
    stack: ["Python", "Django", "Authease"],
    github: "https://github.com/Oluwatemmy/authease-blog-demo",
    live: null,
    category: "app",
    featured: false
  },
  {
    name: "Authease API",
    desc: "RESTful API for Authease — authentication endpoints with strict type validation and PostgreSQL persistence.",
    stack: ["Python", "DRF", "PostgreSQL"],
    github: "https://github.com/Oluwatemmy/authease-api",
    live: null,
    category: "api",
    featured: false
  },
  {
    name: "Pizza Delivery API",
    desc: "Pizza ordering and delivery REST API built with Flask-RESTX.",
    stack: ["Python", "Flask-RESTX"],
    github: "https://github.com/Oluwatemmy/Pizza-Delivery-App",
    live: null,
    category: "api",
    featured: false
  },
  {
    name: "Stores REST API",
    desc: "Store and inventory management REST API with JWT-protected endpoints.",
    stack: ["Python", "Flask", "JWT"],
    github: "https://github.com/Oluwatemmy/stores-rest-api",
    live: null,
    category: "api",
    featured: false
  },
  {
    name: "Blog API",
    desc: "Blogging platform REST API — posts, comments and user management.",
    stack: ["Python", "Django"],
    github: "https://github.com/Oluwatemmy/Blog-API",
    live: null,
    category: "api",
    featured: false
  },
  {
    name: "BaseScan Scraper",
    desc: "Python scraper extracting on-chain data from BaseScan.",
    stack: ["Python", "Scraping"],
    github: "https://github.com/Oluwatemmy/BaseScan-Scraper",
    live: null,
    category: "tool",
    featured: false
  }
];

var CATEGORY_LABELS = {
  package: "PyPI Package",
  api: "REST API",
  app: "Web App",
  tool: "Tool"
};

(function () {
  var grid = document.getElementById("projects-grid");
  if (!grid) return;

  function render(filter) {
    var html = "";
    PROJECTS.forEach(function (p) {
      if (filter !== "all" && p.category !== filter) return;
      var badge = p.featured
        ? '<div class="project-category featured">&#9733; ' + CATEGORY_LABELS[p.category] + "</div>"
        : '<div class="project-category">' + CATEGORY_LABELS[p.category] + "</div>";
      var stack = p.stack.map(function (s) { return "<li>" + s + "</li>"; }).join("");
      var links =
        '<a href="' + p.github + '" target="_blank" rel="noopener"><i class="fa fa-github"></i>GitHub</a>' +
        (p.live ? '<a href="' + p.live + '" target="_blank" rel="noopener"><i class="fa fa-external-link"></i>Live</a>' : "");
      html +=
        '<div class="col-12 col-md-6 col-lg-4 mb-4">' +
          '<div class="project-card">' +
            badge +
            "<h4>" + p.name + "</h4>" +
            "<p>" + p.desc + "</p>" +
            '<ul class="project-stack">' + stack + "</ul>" +
            '<div class="project-links">' + links + "</div>" +
          "</div>" +
        "</div>";
    });
    grid.innerHTML = html;
  }

  document.querySelectorAll(".portfolio-filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".portfolio-filters button").forEach(function (b) {
        b.classList.remove("active");
      });
      this.classList.add("active");
      render(this.getAttribute("data-filter"));
    });
  });

  render("all");
})();
