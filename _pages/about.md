---
permalink: /
title: "Definition"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% assign cv = site.data.cv %}

Zheyuan Wu is an insatiable learner, and is always looking for new challenges and opportunities to learn new things. He believes that the meaning of life is created in those experiences of realizing the potentials of his intelligence and interacting with those great minds.

Some of the topics he is currently actively researching on are:

- Complex projective spaces
- Computer Vision
- Large Language Models

## Axiom 1

The universe, to the best of our knowledge, is a <span class="axiom-note" tabindex="0"><span class="axiom-note__term"><strong><em>playground</em></strong></span><span class="axiom-note__panel" role="tooltip"><span class="axiom-note__title">Definition</span>where we exist, live, and eventually die</span></span> that enables different stories, beliefs, and interpretations.

There are many <span class="axiom-note" tabindex="0"><span class="axiom-note__term"><strong><em>Games</em></strong></span><span class="axiom-note__panel" role="tooltip"><span class="axiom-note__title">Project examples</span>{% assign shown = 0 %}{% for project in cv.portfolio %}{% if project.category contains "Game Development" and shown < 3 %}<span class="axiom-note__project"><a href="/portfolio/#{{ project.name | slugify }}">{{ project.name }}</a><span>{{ project.description-keys[0] }}</span></span>{% assign shown = shown | plus: 1 %}{% endif %}{% endfor %}</span></span> that we can create, play, and share with others. There is no <span class="axiom-note" tabindex="0"><span class="axiom-note__term"><strong><em>standardized</em></strong></span><span class="axiom-note__panel" role="tooltip"><span class="axiom-note__title">Definition</span>that we should believe as the only truth</span></span> meaning, evaluation function, or final rule except the law of <span class="axiom-note" tabindex="0"><span class="axiom-note__term"><strong><em>physics</em></strong></span><span class="axiom-note__panel" role="tooltip"><span class="axiom-note__title">Definition</span>a mathematical model that predicts the universe and passes statistical tests of observation</span></span>.

## Axiom 2

Time is a non-commutative operator that acts on the universe. It is generally not computable and not invertible.

The past will never die, and <span class="axiom-note" tabindex="0"><span class="axiom-note__term">irreversible actions</span><span class="axiom-note__panel" role="tooltip"><span class="axiom-note__title">Project examples</span>{% assign shown = 0 %}{% for project in cv.portfolio %}{% assign desc_text = project.description-keys | join: " " | downcase %}{% assign project_name = project.name | downcase %}{% if desc_text contains "memory archive" or project_name contains "time" or project_name contains "raven" %}{% if shown < 3 %}<span class="axiom-note__project"><a href="/portfolio/#{{ project.name | slugify }}">{{ project.name }}</a><span>{{ project.description-keys[0] }}</span></span>{% assign shown = shown | plus: 1 %}{% endif %}{% endif %}{% endfor %}</span></span> happen constantly, making part, and possibly all, of ourselves into eternity.

We are physically living in the present but can hardly perceive it.

We are natural predictors of the future, and we live on those assumptions.

## Axiom 3

<span class="axiom-note" tabindex="0"><span class="axiom-note__term"><strong><em>Life</em></strong></span><span class="axiom-note__panel" role="tooltip"><span class="axiom-note__title">Definition</span>the subsystem that actively interacts with and changes its environment, measured by degree of connection, entropy, and impact</span></span> is not only an optimization process, but a relationship-making process.

Humans are not isolated minds solving static tasks. We become ourselves through memory, language, care, tools, institutions, and other intelligences. AI should be treated in that same <span class="axiom-note" tabindex="0"><span class="axiom-note__term">relational field</span><span class="axiom-note__panel" role="tooltip"><span class="axiom-note__title">Project examples</span>{% assign shown = 0 %}{% for project in cv.portfolio %}{% assign category_text = project.category | downcase %}{% if category_text contains "large language models" or category_text contains "computer vision" or category_text contains "deep reinforcement learning" or category_text contains "ai" %}{% if shown < 4 %}<span class="axiom-note__project"><a href="/portfolio/#{{ project.name | slugify }}">{{ project.name }}</a><span>{{ project.description-keys[0] }}</span></span>{% assign shown = shown | plus: 1 %}{% endif %}{% endif %}{% endfor %}</span></span>: not as an oracle that replaces human judgment, and not as a passive instrument without consequence, but as a new cognitive partner whose value depends on how honestly it extends human agency, responsibility, creativity, and attention.

The goal is therefore not human versus AI. The goal is a better human-AI ecology: systems where machines amplify exploration and precision, while humans keep authorship, moral context, taste, and the courage to choose.
