---
layout: archive
title: "Portfolio"
permalink: /portfolio/
author_profile: true
---

{% assign cv = site.data.cv %}
{% include base_path %}

<link rel="stylesheet" href="{{ '/scripts/click-copy/click-copy.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/scripts/project-narratives/project-narratives.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/scripts/project-filter/project-filter.css' | relative_url }}">

<div class="project-narratives" data-project-narratives>
  <div class="project-narratives__tabs" role="tablist" aria-label="Project description format">
    <button type="button" id="project-narrative-plain-tab" role="tab" aria-selected="true" aria-controls="project-narrative-page" data-narrative-tab="plain">Plaintext</button>
    <button type="button" id="project-narrative-star-tab" role="tab" aria-selected="false" aria-controls="project-narrative-page" tabindex="-1" data-narrative-tab="star">STAR</button>
    <button type="button" id="project-narrative-tldr-tab" role="tab" aria-selected="false" aria-controls="project-narrative-page" tabindex="-1" data-narrative-tab="tldr">TL;DR</button>
  </div>

  <div id="project-narrative-page" class="project-narratives__page" role="tabpanel" aria-labelledby="project-narrative-plain-tab" data-project-narratives-content>
<section class="project-filter" data-project-filter aria-labelledby="project-filter-title">
  <div class="project-filter__header">
    <h2 id="project-filter-title">Filter</h2>
    <p class="project-filter__status" data-project-filter-status aria-live="polite">Showing all {{ cv.portfolio | size }} projects</p>
  </div>
  <div class="project-filter__options" data-project-filter-options role="group" aria-label="Filter projects by job tag">
    <button type="button" data-job-filter="all" aria-pressed="true" aria-controls="portfolio-projects">All ({{ cv.portfolio | size }})</button>
  </div>
</section>

<ul class="portfolio-list" id="portfolio-projects">
  {% for portfolio in cv.portfolio %}
  {% assign project_job_tags = portfolio["job-tags"] %}
  <li id="{{ portfolio.name | slugify }}" class="portfolio-project" data-job-tags="{{ project_job_tags | join: '|' }}">
    <div class="archive__item-header">
      <h3 class="archive__item-title">
        <span class="click-copy">{{ portfolio.name }}</span>
      </h3>
      {% if portfolio.links %}
      <span class="archive__item-links">
        {% for link in portfolio.links %}
        <a href="{{ link.url }}">
          <i class="fa fa-link"></i>{{ link.label }}</a>
        {% endfor %}
      </span>
      <br>
      {% endif %}
      <span class="archive__item-subtitle">
        {% if portfolio.category %}
        {%- assign category_parts = portfolio.category | split: ", " -%}
        {% for cat in category_parts %}<span class="click-copy">{{ cat }}</span>{% if forloop.last == false %}, {% endif %}{% endfor %}
        {% endif %}
      </span>
      <span class="archive__item-date">
        {% if portfolio.date %}
        <span class="click-copy">{{ portfolio.date }}</span>
        {% endif %}
      </span>

      {% if project_job_tags %}
      <ul class="project-job-tags" aria-label="Job tags">
        {% for job_tag in project_job_tags %}
        <li>{{ job_tag | replace: "-", " " | capitalize }}</li>
        {% endfor %}
      </ul>
      {% endif %}

      {% capture desc_copy %}{% for description in portfolio.description-keys %}{{ description }}
{% endfor %}{% endcapture %}
        <div class="project-narratives__panel archive__item-excerpt click-copy" data-narrative-panel="plain" data-copy="{{ desc_copy | strip | escape }}">
          <ul>
            {% for description in portfolio.description-keys %}
            <li>{{ description }}</li>
            {% endfor %}
          </ul>
        </div>

        {% if portfolio.star %}
        {% capture star_copy %}Situation: {{ portfolio.star.situation }}
Task: {{ portfolio.star.task }}
Action: {{ portfolio.star.action }}
Result: {{ portfolio.star.result }}{% endcapture %}
        <div class="project-narratives__panel click-copy" data-narrative-panel="star" data-copy="{{ star_copy | strip | escape }}" hidden>
          <dl class="project-star">
            <div><dt>Situation</dt><dd>{{ portfolio.star.situation }}</dd></div>
            <div><dt>Task</dt><dd>{{ portfolio.star.task }}</dd></div>
            <div><dt>Action</dt><dd>{{ portfolio.star.action }}</dd></div>
            <div><dt>Result</dt><dd>{{ portfolio.star.result }}</dd></div>
          </dl>
        </div>
        {% endif %}

        {% if portfolio.tldr %}
        <div class="project-narratives__panel project-narratives__tldr click-copy" data-narrative-panel="tldr" data-copy="{{ portfolio.tldr | escape }}" hidden>
          <p>{{ portfolio.tldr }}</p>
        </div>
        {% endif %}
      <p class="archive__item-skills">Skills: {% for skill in portfolio.skills %}<span class="click-copy">{{ skill }}</span>{% if forloop.last == false %}, {% endif %}{% endfor %}</p>
    </div>
  </li>
  {% endfor %}
</ul>
  </div>
</div>

<script src="{{ '/scripts/project-filter/project-filter.js' | relative_url }}"></script>
<script src="{{ '/scripts/project-narratives/project-narratives.js' | relative_url }}"></script>
<script src="{{ '/scripts/click-copy/click-copy.js' | relative_url }}"></script>
