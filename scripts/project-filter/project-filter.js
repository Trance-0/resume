(() => {
  const filter = document.querySelector("[data-project-filter]");

  if (!filter) {
    return;
  }

  const options = filter.querySelector("[data-project-filter-options]");
  const status = filter.querySelector("[data-project-filter-status]");
  const projects = Array.from(document.querySelectorAll(".portfolio-project[data-job-tags]"));
  const preferredOrder = [
    "full-stack",
    "front-end",
    "back-end",
    "algorithm",
    "machine-learning",
    "data-analysis",
    "devops",
    "data-visualization",
    "ui-design",
    "game-development",
    "game-design",
    "mobile",
    "robotics",
    "project-management",
    "event-planning"
  ];
  const labels = {
    "full-stack": "Full-stack",
    "front-end": "Front-end",
    "back-end": "Back-end",
    "algorithm": "Algorithm",
    "machine-learning": "Machine learning",
    "data-analysis": "Data analysis",
    "devops": "DevOps",
    "data-visualization": "Data visualization",
    "ui-design": "UI design",
    "game-development": "Game development",
    "game-design": "Game design",
    "mobile": "Mobile",
    "robotics": "Robotics",
    "project-management": "Project management",
    "event-planning": "Event planning"
  };
  const counts = new Map();

  projects.forEach((project) => {
    const tags = project.dataset.jobTags.split("|").filter(Boolean);
    project.jobTags = tags;
    tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
  });

  const sortedTags = Array.from(counts.keys()).sort((left, right) => {
    const leftIndex = preferredOrder.indexOf(left);
    const rightIndex = preferredOrder.indexOf(right);
    const normalizedLeft = leftIndex === -1 ? preferredOrder.length : leftIndex;
    const normalizedRight = rightIndex === -1 ? preferredOrder.length : rightIndex;

    return normalizedLeft - normalizedRight || left.localeCompare(right);
  });

  sortedTags.forEach((tag) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.jobFilter = tag;
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-controls", "portfolio-projects");
    button.textContent = `${labels[tag] || tag} (${counts.get(tag)})`;
    options.appendChild(button);
  });

  const buttons = Array.from(options.querySelectorAll("[data-job-filter]"));

  function showProjects(tag) {
    let visibleCount = 0;

    projects.forEach((project) => {
      const visible = tag === "all" || project.jobTags.includes(tag);
      project.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.jobFilter === tag));
    });

    if (tag === "all") {
      status.textContent = `Showing all ${projects.length} projects`;
    } else {
      status.textContent = `Showing ${visibleCount} projects tagged ${labels[tag] || tag}`;
    }
  }

  options.addEventListener("click", (event) => {
    const button = event.target.closest("[data-job-filter]");
    if (button && options.contains(button)) {
      showProjects(button.dataset.jobFilter);
    }
  });

  filter.dataset.enhanced = "true";
})();
