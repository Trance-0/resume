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

<h2>{{ cv.qa.title }}</h2>
<p>{{ cv.qa.blurb }}</p>
<p>{{ cv.qa.intro }}</p>
<p>Last updated on {{ cv.qa.last_updated }}</p>

{% for item in cv.qa.items %}
<details class="detail-group">
  <summary>
    <h3>Q: {{ item.question }}</h3>
  </summary>
  <div class="detail-body click-copy">
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

{% endif %}

<script src="{{ '/scripts/click-copy/click-copy.js' | relative_url }}"></script>
