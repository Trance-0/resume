---
layout: archive
title: "Q&A"
permalink: /qa/
author_profile: true
---

{% assign cv = site.data.cv %}
{% include base_path %}

<link rel="stylesheet" href="{{ '/scripts/click-copy/click-copy.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/scripts/detail-sections/detail-sections.css' | relative_url }}">

{% if cv.qa.items %}

Here is a list of common questions that interviewers might ask, and I'm happy to share my answers with everyone. Click any answer to copy it to your clipboard.

Last updated on 2026-05-25

<details class="detail-group">
  <summary>
    <h3>{{ cv.qa.title }}</h3>
    <span class="detail-blurb">{{ cv.qa.blurb }}</span>
  </summary>
  <div class="detail-body">
    {% for item in cv.qa.items %}
    <details>
      <summary><strong>Q: {{ item.question }}</strong></summary>
      <div class="click-copy">
        {% assign paragraphs = item.answer | split: '\n\n' %}
        {% for paragraph in paragraphs %}
          {% assign trimmed = paragraph | strip %}
          {% if trimmed != '' %}
            <p>{{ trimmed | newline_to_br }}</p>
          {% endif %}
        {% endfor %}
      </div>
    </details>
    {% endfor %}
  </div>
</details>

{% endif %}

<script src="{{ '/scripts/click-copy/click-copy.js' | relative_url }}"></script>
