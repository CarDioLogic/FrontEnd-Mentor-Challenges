const jobsContainer = document.getElementById("jobs-container");
const filtersContainer = document.getElementById("filters-options-container");
let jobs = [];
let filters = [];
document.addEventListener("DOMContentLoaded", async () => {
    await init();
    setupEvents();
});
function setupEvents() {
    var _a;
    (_a = document.getElementById("clear-filters-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        clearFilters();
    });
}
function renderJobsTagItemEvents() {
    let tagItensEls = document.querySelectorAll(".tag-item");
    tagItensEls.forEach(itemEl => {
        let tagItem = itemEl.getAttribute("data-tagitem");
        itemEl.addEventListener("click", () => {
            if (tagItem)
                addToFilters(tagItem);
        });
    });
}
async function init() {
    try {
        jobs = await fetchJobs();
        rendersJobs();
    }
    catch (err) {
        console.error("Error initializing", err);
    }
}
function clearFilters() {
    //not very performance friendly, but works for challenge
    filters = [];
    renderFilters();
}
function addToFilters(filter) {
    //not very performance friendly, but works for challenge
    if (filters.includes(filter)) {
        remvoveFromFilters(filter);
    }
    else {
        filters.push(filter);
    }
    ;
    renderFilters();
}
function remvoveFromFilters(filter) {
    //not very performance friendly, but works for challenge
    filters = filters.filter(f => f !== filter);
    renderFilters();
}
function renderFilters() {
    var _a, _b;
    (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.classList.remove("filter-visible");
    if (filters.length > 0)
        (_b = document.querySelector("body")) === null || _b === void 0 ? void 0 : _b.classList.add("filter-visible");
    let html = "";
    filters.forEach(filter => {
        html += `
      <div class="filter-option">
        <span>${filter}</span>
        <button class="clear-option-btn" data-filter='${filter}'>
          <img src="images/icon-remove.svg" alt="">
        </button>
      </div>`;
    });
    filtersContainer.innerHTML = html;
    renderFilterEvents();
    rendersJobs();
}
function renderFilterEvents() {
    let filterOptionEls = document.querySelectorAll('.clear-option-btn');
    filterOptionEls.forEach(optEl => {
        let filterOption = optEl.getAttribute("data-filter");
        optEl.addEventListener("click", () => {
            if (filterOption)
                remvoveFromFilters(filterOption);
            renderFilters();
        });
    });
}
function rendersJobs() {
    let html = '';
    jobs.forEach(job => {
        const matchesAllFilters = filters.length === 0 ||
            filters.every(filter => job.role === filter ||
                job.level === filter ||
                job.languages.includes(filter) ||
                job.tools.includes(filter));
        if (matchesAllFilters) {
            html += renderJob(job);
        }
    });
    jobsContainer.innerHTML = html;
    renderJobsTagItemEvents();
}
function renderJob(job) {
    let html = `<div class="job-item ${job.featured ? 'featured' : ''}
     ${job.new ? 'new' : ''}">
      <div class="job-image">
        <img src="${job.logo}" alt="imagem">
      </div>
      <div class="job-details-container">
        <div class="header">
          <span>${job.company}</span>
          <div class="badges">`;
    if (job.new)
        html += `<div class="new"><span>NEW!</span></div>`;
    if (job.featured)
        html += `<div class="featured"><span>FEATURED</span></div>`;
    html +=
        `</div>
        </div>
        <h3 class="job-title">${job.position}</h3>
        <div class="job-info">
          <span class="posted">${job.postedAt}</span>
          <span class="separator">*</span>
          <span class="contract">${job.contract}</span>
          <span class="separator">*</span>
          <span class="location">${job.location}</span>
        </div>
      </div>
      <div class="tags-container">
        <span class="tag-item" data-tagitem='${job.role}'>${job.role}</span>                
        <span class="tag-item" data-tagitem='${job.level}'>${job.level}</span>`;
    job.languages.forEach(lang => {
        html += `<span class="tag-item" data-tagitem='${lang}'>${lang}</span>`;
    });
    job.tools.forEach(tool => {
        html += `<span class="tag-item" data-tagitem='${tool}'>${tool}</span>`;
    });
    html += `
      </div>
    </div>
    `;
    return html;
}
async function fetchJobs() {
    const res = await fetch("./data.json");
    if (!res.ok) {
        throw new Error(`Failed to fetch jobs: ${res.status}`);
    }
    const data = await res.json();
    return data;
}
export {};
//# sourceMappingURL=script.js.map