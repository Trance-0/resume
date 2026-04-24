---
layout: archive
title: "Portfolio"
permalink: /portfolio/
author_profile: true
---

{% include base_path %}

{% assign cv = site.data.cv %}
{% include base_path %}

<link rel="stylesheet" href="{{ '/scripts/click-copy/click-copy.css' | relative_url }}">

<ul>
  {% for portfolio in cv.portfolio %}
  <li>
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
      {% capture desc_copy %}{% for description in portfolio.description-keys %}{{ description }}
{% endfor %}{% endcapture %}
      <div class="archive__item-excerpt click-copy" data-copy="{{ desc_copy | strip | escape }}">
        <ul>
          {% for description in portfolio.description-keys %}
          <li>{{ description }}</li>
          {% endfor %}
        </ul>
      </div>
      <p class="archive__item-skills">Skills: {% for skill in portfolio.skills %}<span class="click-copy">{{ skill }}</span>{% if forloop.last == false %}, {% endif %}{% endfor %}</p>
    </div>
  </li>
  {% endfor %}
</ul>

<script src="{{ '/scripts/click-copy/click-copy.js' | relative_url }}"></script>
