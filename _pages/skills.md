---
layout: archive
title: "Skill tree"
permalink: /skills/
author_profile: true
redirect_from:
  - /skill-tree
---

{% assign cv = site.data.cv %}
{% include base_path %}

<link rel="stylesheet" href="{{ '/scripts/click-copy/click-copy.css' | relative_url }}">

Here is a list of skills I have learned over the years and might be useful for you.

{% include skill-tree.html %}

{% for section in cv.skills %}
<h3>{{ section.semesters }}</h3>
<ul>
  {% for course in section.courses %}
  <li>
    <span class="archive__item-title">
      {%- assign name_parts = course.name | split: " (" -%}
      {%- if name_parts.size > 1 -%}
        {%- assign title_part = name_parts[1] | split: ")" | first -%}
        <span class="click-copy">{{ name_parts[0] }}</span> (<span class="click-copy">{{ title_part }}</span>)
      {%- else -%}
        <span class="click-copy">{{ course.name }}</span>
      {%- endif -%}
    </span> (<span class="click-copy">{{ course.level }}</span>)
    {% if course.textbooks %}
        {% for link in course.textbooks %}
        <br>
          <span class="archive__item-links">
            <a href="{{ link.url }}">
              <i class="fa fa-link"></i>{{ link.name }}</a>
          </span>
        {% endfor %}
    {% endif %}
    {% if course.tags %}
    <br>
        <span class="archive__subtitle">
        {% for tag in course.tags %}
        <span class="archive__item-links"><span class="click-copy">{{ tag }}</span>{% if forloop.last == false %}, {% endif %}</span>
        {% endfor %}
        </span>
    {% endif %}
    {% if course.description %}
    <br>
    <span class="archive__item-excerpt click-copy">{{ course.description }}</span>
    {% endif %}
  </li>
  {% endfor %}
</ul>
{% endfor %}

<script src="{{ '/scripts/click-copy/click-copy.js' | relative_url }}"></script>
