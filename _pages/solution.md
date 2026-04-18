---
layout: archive
title: "Solution"
permalink: /solution/
author_profile: true
---

{% assign cv = site.data.cv %}
{% include base_path %}

<style>
  .solution-group {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    margin: 1rem 0;
    background: #fafafa;
    overflow: hidden;
  }
  .solution-group > summary {
    list-style: none;
    cursor: pointer;
    padding: 1rem 1.25rem;
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .solution-group > summary::-webkit-details-marker { display: none; }
  .solution-group > summary::marker { content: ""; }
  .solution-group > summary h3 {
    display: inline;
    color: #fff;
    margin: 0;
    font-size: 1.15rem;
  }
  .solution-group > summary .solution-blurb {
    font-size: 0.9rem;
    opacity: 0.9;
    font-style: italic;
    margin-left: 1rem;
  }
  .solution-body {
    padding: 0.5rem 1.25rem 1rem;
  }
  .solution-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0.85rem 1rem;
    margin: 0.75rem 0;
  }
  .solution-card h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
  }
  .solution-card .solution-meta {
    font-size: 0.8rem;
    color: #475569;
    margin-bottom: 0.45rem;
  }
  .solution-card .solution-meta a { margin-right: 0.5rem; }
  .solution-card ul {
    margin: 0.3rem 0 0.3rem 1rem;
    padding: 0;
    font-size: 0.92rem;
    line-height: 1.45;
  }
  .solution-tags {
    margin-top: 0.35rem;
    font-size: 0.78rem;
    color: #6b7280;
  }

  html[data-theme="dark"] .solution-group {
    border-color: #4b5563;
    background: #2e2e2e;
  }
  html[data-theme="dark"] .solution-group > summary {
    background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);
    color: #f1f5f9;
  }
  html[data-theme="dark"] .solution-group > summary h3 {
    color: #f1f5f9;
  }
  html[data-theme="dark"] .solution-card {
    background: #374151;
    border-color: #4b5563;
    color: #f1f5f9;
  }
  html[data-theme="dark"] .solution-card .solution-meta {
    color: #cbd5e1;
  }
  html[data-theme="dark"] .solution-card .solution-meta a {
    color: #60a5fa;
  }
  html[data-theme="dark"] .solution-tags {
    color: #9ca3af;
  }
</style>

A narrative index of what I've actually been working on. Each section is collapsed by default — click to unfold the projects and coursework behind it.

{% assign frontier_subs = "Computer Vision,Large Language Models,Deep Reinforcement Learning,Machine Learning,AI/Robotics" | split: "," %}
{% assign lifehack_subs = "Web Development,Mobile Development,Club" | split: "," %}
{% assign narrative_subs = "Game Development" | split: "," %}

<details class="solution-group">
  <summary>
    <h3>I'm experimenting with frontier research fields</h3>
    <span class="solution-blurb">SOTA work in large language models, computer vision, and deep reinforcement learning — where the tools are still being invented.</span>
  </summary>
  <div class="solution-body">
    {% for p in cv.portfolio %}
      {% assign sub = p.topicCategory[1] %}
      {% if frontier_subs contains sub %}
        <div class="solution-card">
          <h4>{{ p.name }}</h4>
          <div class="solution-meta">
            <i class="fa fa-calendar"></i> {{ p.date }}
            {% if p.organization %} · {{ p.organization }}{% endif %}
            {% if p.links %}
              · {% for link in p.links %}<a href="{{ link.url }}"><i class="fa fa-link"></i> {{ link.label }}</a>{% unless forloop.last %} · {% endunless %}{% endfor %}
            {% endif %}
          </div>
          <ul>
            {% for d in p.description-keys %}<li>{{ d }}</li>{% endfor %}
          </ul>
          {% if p.skills %}<div class="solution-tags">Skills: {{ p.skills | join: ", " }}</div>{% endif %}
        </div>
      {% endif %}
    {% endfor %}
  </div>
</details>

<details class="solution-group">
  <summary>
    <h3>I'm working on life hacking and improving my communities</h3>
    <span class="solution-blurb">Productivity tools, web apps, shared notes, and the student communities I help keep running.</span>
  </summary>
  <div class="solution-body">
    {% for p in cv.portfolio %}
      {% assign sub = p.topicCategory[1] %}
      {% if lifehack_subs contains sub %}
        <div class="solution-card">
          <h4>{{ p.name }}</h4>
          <div class="solution-meta">
            <i class="fa fa-calendar"></i> {{ p.date }}
            {% if p.organization %} · {{ p.organization }}{% endif %}
            {% if p.links %}
              · {% for link in p.links %}<a href="{{ link.url }}"><i class="fa fa-link"></i> {{ link.label }}</a>{% unless forloop.last %} · {% endunless %}{% endfor %}
            {% endif %}
          </div>
          <ul>
            {% for d in p.description-keys %}<li>{{ d }}</li>{% endfor %}
          </ul>
          {% if p.skills %}<div class="solution-tags">Skills: {{ p.skills | join: ", " }}</div>{% endif %}
        </div>
      {% endif %}
    {% endfor %}
  </div>
</details>

<details class="solution-group">
  <summary>
    <h3>I'm testing the boundary of my intelligence</h3>
    <span class="solution-blurb">Pure math and theoretic coursework — the stuff I take to find out where the ceiling actually is.</span>
  </summary>
  <div class="solution-body">
    {% for section in cv.skills %}
      {% for c in section.courses %}
        {% assign top = c.category[0] %}
        {% if top == "Mathematics" %}
          <div class="solution-card">
            <h4>{{ c.name }}</h4>
            <div class="solution-meta">
              <i class="fa fa-calendar"></i> {{ section.semesters }} · {{ c.level }}
              {% if c.textbooks %}
                {% for t in c.textbooks %} · <a href="{{ t.url }}"><i class="fa fa-book"></i> {{ t.name }}</a>{% endfor %}
              {% endif %}
            </div>
            {% if c.description %}<p style="margin: 0.25rem 0; font-size: 0.92rem;">{{ c.description }}</p>{% endif %}
            {% if c.tags %}<div class="solution-tags">Topics: {{ c.tags | join: ", " }}</div>{% endif %}
          </div>
        {% endif %}
      {% endfor %}
    {% endfor %}
  </div>
</details>

<details class="solution-group">
  <summary>
    <h3>I'm creating new narratives</h3>
    <span class="solution-blurb">Games and worlds I've built — interactive stories rather than shipped products.</span>
  </summary>
  <div class="solution-body">
    {% for p in cv.portfolio %}
      {% assign sub = p.topicCategory[1] %}
      {% if narrative_subs contains sub %}
        <div class="solution-card">
          <h4>{{ p.name }}</h4>
          <div class="solution-meta">
            <i class="fa fa-calendar"></i> {{ p.date }}
            {% if p.organization %} · {{ p.organization }}{% endif %}
            {% if p.links %}
              · {% for link in p.links %}<a href="{{ link.url }}"><i class="fa fa-link"></i> {{ link.label }}</a>{% unless forloop.last %} · {% endunless %}{% endfor %}
            {% endif %}
          </div>
          <ul>
            {% for d in p.description-keys %}<li>{{ d }}</li>{% endfor %}
          </ul>
          {% if p.skills %}<div class="solution-tags">Skills: {{ p.skills | join: ", " }}</div>{% endif %}
        </div>
      {% endif %}
    {% endfor %}
    {% for section in cv.skills %}
      {% for c in section.courses %}
        {% if c.category[1] == "Game Development" %}
          <div class="solution-card">
            <h4>{{ c.name }}</h4>
            <div class="solution-meta">
              <i class="fa fa-calendar"></i> {{ section.semesters }} · {{ c.level }}
            </div>
            {% if c.description %}<p style="margin: 0.25rem 0; font-size: 0.92rem;">{{ c.description }}</p>{% endif %}
            {% if c.tags %}<div class="solution-tags">Topics: {{ c.tags | join: ", " }}</div>{% endif %}
          </div>
        {% endif %}
      {% endfor %}
    {% endfor %}
  </div>
</details>
