const narrativeGroup = document.querySelector('[data-project-narratives]');

if (narrativeGroup) {
  const tabs = Array.from(narrativeGroup.querySelectorAll('[data-narrative-tab]'));
  const panels = Array.from(narrativeGroup.querySelectorAll('[data-narrative-panel]'));
  const page = narrativeGroup.querySelector('[data-project-narratives-content]');

  const activate = (selectedTab, moveFocus = false) => {
    const selectedName = selectedTab.dataset.narrativeTab;

    tabs.forEach((tab) => {
      const active = tab === selectedTab;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.narrativePanel !== selectedName;
    });

    page.setAttribute('aria-labelledby', selectedTab.id);

    if (moveFocus) selectedTab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = null;

      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;

      if (nextIndex === null) return;
      event.preventDefault();
      activate(tabs[nextIndex], true);
    });
  });
}
