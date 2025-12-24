document.addEventListener("DOMContentLoaded", () => {
  let projects = [];
  
  
/* =========================
     1. HELPER FUNCTIONS
     ========================= */
    
  
  function getStatus(project) {
    const lastDate = new Date(project.end_date);
    const diffDays = (new Date() - lastDate) / (1000 * 60 * 60 * 24);

    if (diffDays <= 30) return { label: "Active", class: "active" };
    if (diffDays <= 90) return { label: "In Progress", class: "progress" };
    return { label: "Stale", class: "stale" };
  }
  
  
  function durationBucket(days) {
    if (days <= 7) return "short";
    if (days <= 30) return "medium";
    return "long";
  }
  
  
  function populateLanguageFilter(data) {
    const select = document.getElementById("languageFilter");
    if (!select) return;

    select.innerHTML = `<option value="">All Languages</option>`;

    const languages = new Set();
    data.forEach(p => {
      if (p.language) languages.add(p.language);
    });

    languages.forEach(lang => {
      const opt = document.createElement("option");
      opt.value = lang;
      opt.textContent = lang;
      select.appendChild(opt);
    });
  }
  
  function applyFilters() {
    const statusVal = document.getElementById("statusFilter").value || "";
    const durationVal = document.getElementById("durationFilter").value || "";
    const languageVal = document.getElementById("languageFilter").value || "";
    const searchVal = document.getElementById("search").value.toLowerCase();
    
    
    const filtered = projects.filter(p => {
      
      
      // STATUS FILTER
      if (statusVal !== ""){
        const status = getStatus(p).label;
        if (status !== statusVal) return false;
      }
      
      // DURATION FILTER
      if (durationVal !== "") {
        const bucket = durationBucket(p.days_taken);
        if (bucket !== durationVal) return false;
      }

      // LANGUAGE FILTER (SAFE)
      if (languageVal !== "") {
        if (!p.language) return false;           // handles null
        if (p.language !== languageVal) return false;
      }

      // SEARCH FILTER
      if (searchVal !== "") {
        if (!p.repository.toLowerCase().includes(searchVal)) return false;
      }
      
      return true;
    });
    
    renderTable(filtered);
  }


/* =========================
     2. RENDER FUNCTIONS
     ========================= */



  function renderMetrics(data) {
    const metrics = document.getElementById("metrics");
    if (!metrics) {
      return;
    }

    const total = data.length;
    const active = data.filter(p => getStatus(p).label === "Active").length;
    const avg =
      total === 0 ? 0 :
      Math.round(data.reduce((s, p) => s + p.days_taken, 0) / total);

    metrics.innerHTML = `
      <div class="metric-card">
        <h3>Total Repos</h3>
        <p>${total}</p>
      </div>
      <div class="metric-card">
        <h3>Active</h3>
        <p>${active}</p>
      </div>
      <div class="metric-card">
        <h3>Avg Duration</h3>
        <p>${avg} days</p>
      </div>
    `;
  }

  function renderTable(data) {
    const table = document.getElementById("project-table");
    if (!table) {
      return;
    }

    table.innerHTML = "";

    if (data.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="6">No repositories found</td>
        </tr>
      `;
      return;
    }

    const maxDays = Math.max(...data.map(p => p.days_taken));

    data.forEach(project => {
      const status = getStatus(project);
      const progress = (project.days_taken / maxDays) * 100;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${project.repository}</td>
        <td><span class="badge ${status.class}">${status.label}</span></td>
        <td>${project.start_date}</td>
        <td>${project.end_date}</td>
        <td>${project.days_taken}</td>
        <td>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${progress}%"></div>
          </div>
        </td>
      `;

      row.addEventListener("click", () => openDrawer(project));
      table.appendChild(row);
    });
  }


/* =========================
   3. ASYNC / IO FUNCTIONS
   ========================= */
  

  async function loadProjects() {

    const res = await fetch("http://127.0.0.1:8000/projects");
    const data = await res.json();

    projects = data;
    populateLanguageFilter(projects);
    renderMetrics(projects);
    renderTable(projects);
  }


  async function openDrawer(project) {
    const drawer = document.getElementById("drawer");
    if (!drawer) return;

    drawer.classList.remove("hidden");
    drawer.innerHTML = "<p>Loading...</p>";

    const res = await fetch(
      `http://127.0.0.1:8000/projects/${project.repository}`
    );
    const data = await res.json();

    drawer.innerHTML = `
      <h2>${data.repository}</h2>
      <p><strong>Description:</strong> ${data.description || "N/A"}</p>
      <p><strong>Language:</strong> ${data.language || "N/A"}</p>
      <p><strong>Total Commits:</strong> ${data.total_commits}</p>
      <p><strong>Avg Commits/Week:</strong> ${data.avg_commits_per_week}</p>

      <h3>Last Commit</h3>
      <p>${data.last_commit.message}</p>
      <p>${data.last_commit.author} — ${data.last_commit.date}</p>

      <button onclick="document.getElementById('drawer').classList.add('hidden')">
        Close
      </button>
    `;
  }


/* =========================
   4. EVENT WIRING
   ========================= */

 
  ["statusFilter", "durationFilter", "languageFilter"].forEach(id => {
  document.getElementById(id)?.addEventListener("change", applyFilters);
  });

  document.getElementById("search")?.addEventListener("input", applyFilters);


/* =========================
   5. BOOTSTRAP
   ========================= */

  loadProjects();
});
