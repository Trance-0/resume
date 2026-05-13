---
layout: archive
title: "Solution"
permalink: /solution/
author_profile: true
---

{% assign cv = site.data.cv %}
{% include base_path %}

<link rel="stylesheet" href="{{ '/scripts/detail-sections/detail-sections.css' | relative_url }}">

A narrative index of what I've actually been working on. Each section is collapsed by default 鈥?click to unfold the projects and coursework behind it.

{% assign frontier_subs = "Computer Vision,Large Language Models,Deep Reinforcement Learning,Machine Learning,AI/Robotics" | split: "," %}
{% assign lifehack_subs = "Web Development,Mobile Development,Club" | split: "," %}
{% assign narrative_subs = "Game Development" | split: "," %}

<details class="detail-group">
  <summary>
    <h3>I'm experimenting with frontier research fields</h3>
    <span class="detail-blurb">SOTA work in large language models, computer vision, and deep reinforcement learning 鈥?where the tools are still being invented.</span>
  </summary>
  <div class="detail-body">
    {% for p in cv.portfolio %}
      {% assign sub = p.topicCategory[1] %}
      {% if frontier_subs contains sub %}
        <div class="detail-card">
          <h4>{{ p.name }}</h4>
          <div class="detail-meta">
            <i class="fa fa-calendar"></i> {{ p.date }}
            {% if p.organization %} 路 {{ p.organization }}{% endif %}
            {% if p.links %}
              路 {% for link in p.links %}<a href="{{ link.url }}"><i class="fa fa-link"></i> {{ link.label }}</a>{% unless forloop.last %} 路 {% endunless %}{% endfor %}
            {% endif %}
          </div>
          <ul>
            {% for d in p.description-keys %}<li>{{ d }}</li>{% endfor %}
          </ul>
          {% if p.skills %}<div class="detail-tags">Skills: {{ p.skills | join: ", " }}</div>{% endif %}
        </div>
      {% endif %}
    {% endfor %}
  </div>
</details>

<details class="detail-group">
  <summary>
    <h3>I'm working on life hacking and improving my communities</h3>
    <span class="detail-blurb">Productivity tools, web apps, shared notes, and the student communities I help keep running.</span>
  </summary>
  <div class="detail-body">
    {% for p in cv.portfolio %}
      {% assign sub = p.topicCategory[1] %}
      {% if lifehack_subs contains sub %}
        <div class="detail-card">
          <h4>{{ p.name }}</h4>
          <div class="detail-meta">
            <i class="fa fa-calendar"></i> {{ p.date }}
            {% if p.organization %} 路 {{ p.organization }}{% endif %}
            {% if p.links %}
              路 {% for link in p.links %}<a href="{{ link.url }}"><i class="fa fa-link"></i> {{ link.label }}</a>{% unless forloop.last %} 路 {% endunless %}{% endfor %}
            {% endif %}
          </div>
          <ul>
            {% for d in p.description-keys %}<li>{{ d }}</li>{% endfor %}
          </ul>
          {% if p.skills %}<div class="detail-tags">Skills: {{ p.skills | join: ", " }}</div>{% endif %}
        </div>
      {% endif %}
    {% endfor %}
  </div>
</details>

<details class="detail-group">
  <summary>
    <h3>I'm testing the boundary of my intelligence</h3>
    <span class="detail-blurb">Pure math and theoretic coursework 鈥?the stuff I take to find out where the ceiling actually is.</span>
  </summary>
  <div class="detail-body">
    {% for section in cv.skills %}
      {% for c in section.courses %}
        {% assign top = c.category[0] %}
        {% if top == "Mathematics" %}
          <div class="detail-card">
            <h4>{{ c.name }}</h4>
            <div class="detail-meta">
              <i class="fa fa-calendar"></i> {{ section.semesters }} 路 {{ c.level }}
              {% if c.textbooks %}
                {% for t in c.textbooks %} 路 <a href="{{ t.url }}"><i class="fa fa-book"></i> {{ t.name }}</a>{% endfor %}
              {% endif %}
            </div>
            {% if c.description %}<p style="margin: 0.25rem 0; font-size: 0.92rem;">{{ c.description }}</p>{% endif %}
            {% if c.tags %}<div class="detail-tags">Topics: {{ c.tags | join: ", " }}</div>{% endif %}
          </div>
        {% endif %}
      {% endfor %}
    {% endfor %}
  </div>
</details>

<details class="detail-group">
  <summary>
    <h3>I'm creating new narratives</h3>
    <span class="detail-blurb">Games and worlds I've built 鈥?interactive stories rather than shipped products.</span>
  </summary>
  <div class="detail-body">
    {% for p in cv.portfolio %}
      {% assign sub = p.topicCategory[1] %}
      {% if narrative_subs contains sub %}
        <div class="detail-card">
          <h4>{{ p.name }}</h4>
          <div class="detail-meta">
            <i class="fa fa-calendar"></i> {{ p.date }}
            {% if p.organization %} 路 {{ p.organization }}{% endif %}
            {% if p.links %}
              路 {% for link in p.links %}<a href="{{ link.url }}"><i class="fa fa-link"></i> {{ link.label }}</a>{% unless forloop.last %} 路 {% endunless %}{% endfor %}
            {% endif %}
          </div>
          <ul>
            {% for d in p.description-keys %}<li>{{ d }}</li>{% endfor %}
          </ul>
          {% if p.skills %}<div class="detail-tags">Skills: {{ p.skills | join: ", " }}</div>{% endif %}
        </div>
      {% endif %}
    {% endfor %}
    {% for section in cv.skills %}
      {% for c in section.courses %}
        {% if c.category[1] == "Game Development" %}
          <div class="detail-card">
            <h4>{{ c.name }}</h4>
            <div class="detail-meta">
              <i class="fa fa-calendar"></i> {{ section.semesters }} 路 {{ c.level }}
            </div>
            {% if c.description %}<p style="margin: 0.25rem 0; font-size: 0.92rem;">{{ c.description }}</p>{% endif %}
            {% if c.tags %}<div class="detail-tags">Topics: {{ c.tags | join: ", " }}</div>{% endif %}
          </div>
        {% endif %}
      {% endfor %}
    {% endfor %}
  </div>
</details>
