---
layout: archive
title: "Portfolio"
permalink: /portfolio/
author_profile: true
---

{% include base_path %}

{% assign cv = site.data.cv %}
{% include base_path %}

<ul>
  {% for portfolio in cv.portfolio %}
  <li>
    <div class="archive__item-header">
      <h3 class="archive__item-title">
        {{ portfolio.name }}
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
        {{ portfolio.category }}
        {% endif %}
      </span>
      <span class="archive__item-date">
        {% if portfolio.date %}
        {{ portfolio.date }}
        {% endif %}
      </span>
      <div class="archive__item-excerpt">
        <ul>
          {% for description in portfolio.description-keys %}
          <li>{{ description }}</li>
          {% endfor %}
        </ul>
      </div>
      <p class="archive__item-skills">Skills: {{ portfolio.skills | join: ", " }}</p>
    </div>
  </li>
  {% endfor %}
</ul>


