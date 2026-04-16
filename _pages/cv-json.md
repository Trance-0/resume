---
layout: archive
title: "CV"
permalink: /cv-json/
author_profile: false
redirect_from:
  - /resume-json
---

{% include base_path %}

<link rel="stylesheet" href="{{ base_path }}/assets/css/cv-style.css">
<link rel="stylesheet" href="{{ base_path }}/assets/css/cv-layout.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

<style>
  .archive {
    width: 90%;
    margin: 0 auto;
    float: none;
    padding-right: 0;
  }

  @media (min-width: 80em) {
    .archive {
      width: 75%;
    }
  }
</style>

<div class="cv-toolbar" id="cv-toolbar">
  <button type="button" class="btn btn--primary" onclick="window.print()">
    <i class="fas fa-print"></i> Print / Save as PDF
  </button>
  <a href="#" class="btn btn--inverse" id="cv-download-json" download="cv.json">
    <i class="fas fa-download"></i> Download cv.json
  </a>
  <a href="{{ '/cv/' | relative_url }}" class="btn btn--inverse">
    <i class="fas fa-file-alt"></i> Markdown CV
  </a>
</div>

{% include cv-template.html %}

<script id="cv-json-payload" type="application/json">{{ site.data.cv | jsonify | replace: "</", "<\/" }}</script>
<script>
  (function () {
    var btn = document.getElementById('cv-download-json');
    var payload = document.getElementById('cv-json-payload');
    if (!btn || !payload) return;
    var blob = new Blob([payload.textContent], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    btn.setAttribute('href', url);
  })();
</script>
