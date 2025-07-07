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

Here is a list of skills I have learned over the years and might be useful for you.

{% for section in cv.skills %}
<h3>{{ section.semesters }}</h3>
<ul>
  {% for course in section.courses %}
  <li><span class="archive__item-title">{{ course.name }}</span> ({{ course.level }})
    {% if course.tags %}
    <br>
        <span class="archive__subtitle">
        {% for tag in course.tags %}
        <span class="archive__item-links">{{ tag }}{% if forloop.last == false %},{% endif %}</span>
        {% endfor %}
        </span>
    {% endif %}
    {% if course.description %}
    <br>
    <span class="archive__item-excerpt">{{ course.description }}</span>
    {% endif %}
  </li>
  {% endfor %}
</ul>
{% endfor %}