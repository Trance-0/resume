---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% assign cv = site.data.cv %}
{% include base_path %}

Education
======
<ul class="cv-list">
  {% for education in cv.education %}
  <li class="cv-item">
    <div class="cv-item-header">
      <div class="cv-item-title">{{ education.studyType }} in {{ education.area }}</div>
      <div class="cv-item-date"><i class="fa fa-calendar"></i> {{ education.startDate }} - {{ education.endDate }}</div>
    </div>
    <div class="cv-item-content">
      <div class="cv-item-subtitle">{{ education.institution }}</div>
      {% if education.gpa %}
      <div class="cv-item-detail">GPA: {{ education.gpa }}</div>
      {% endif %}
      {% if education.focus.size > 0 %}
      <div class="cv-item-detail">
        <strong>Focus:</strong> {{ education.focus | join: ", " }}
      </div>
      {% endif %}
    </div>
  </li>
  {% endfor %}
</ul>

Work experience
======

<ul class="cv-list">
      {% for work in cv.work %}
      <li class="cv-item">
        <div class="cv-item-header">
          <div class="cv-item-title">{{ work.position }}</div>
          <div class="cv-item-date"><i class="fa fa-calendar"></i> {{ work.startDate }}{% if work.endDate %} - {{ work.endDate }}{% endif %}</div>
        </div>
        <div class="cv-item-content">
          <div class="cv-item-subtitle">{{ work.company }}</div>
          {% if work.summary %}
          <div class="cv-item-detail">{{ work.summary }}</div>
          {% endif %}
          {% if work.highlights.size > 0 %}
          <ul class="cv-highlights">
            {% for highlight in work.highlights %}
            <li>{{ highlight }}</li>
            {% endfor %}
          </ul>
          {% endif %}
        </div>
      </li>
      {% endfor %}
    </ul>
  
Talks
======
  <ul class="cv-list">
    {% for talk in cv.presentations %}
    <li class="cv-item">
      <div class="cv-item-header">
        <div class="cv-item-title">{{ talk.name }}</div>
        <div class="cv-item-date"><i class="fa fa-calendar"></i> {{ talk.date }}</div>
      </div>
      <div class="cv-item-content">
        <div class="cv-item-subtitle">{{ talk.event }}</div>
        {% if talk.location %}
        <div class="cv-item-detail">{{ talk.location }}</div>
        {% endif %}
        {% if talk.description %}
        <div class="cv-item-detail">{{ talk.description }}</div>
        {% endif %}
      </div>
    </li>
    {% endfor %}
  </ul>
  
