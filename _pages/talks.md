---
layout: archive
title: "Talks and presentations"
permalink: /talks/
author_profile: true
---

{% assign cv = site.data.cv %}
{% include base_path %}

<ul>
  {% for presentation in cv.presentations %}
  <li>
    <div class="archive__item-header">
      <h3 class="archive__item-title">
        {{ presentation.name }}
        {% if presentation.url %}
        <span class="archive__item-links">
          <a href="{{ presentation.url }}">
            <i class="fa fa-link"></i>
          </a>
        </span>
        {% endif %}
      </h3>
      <span class="archive__item-date">
        {% if presentation.date %}
        <i class="fa fa-calendar"></i> {{ presentation.date }}
        {% endif %}
      </span>
      <span class="archive__item-subtitle">
        {% if presentation.event %}
        | {{ presentation.event }}
        {% endif %}
      </span>
      {% if presentation.location %}
      <div class="archive__item-detail">
        Location: {{ presentation.location }}
      </div>
      {% endif %}
      {% if presentation.description %}
      <div class="archive__item-excerpt">
        {{ presentation.description }}
      </div>
      {% endif %}
    </div>
  </li>
  {% endfor %}
</ul>
