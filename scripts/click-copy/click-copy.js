(function () {
  'use strict';

  function showPopup(x, y, text) {
    var popup = document.createElement('div');
    popup.className = 'click-copy-popup';
    popup.textContent = text;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    document.body.appendChild(popup);
    requestAnimationFrame(function () {
      popup.classList.add('is-visible');
    });
    setTimeout(function () {
      popup.classList.remove('is-visible');
      setTimeout(function () {
        if (popup.parentNode) popup.parentNode.removeChild(popup);
      }, 250);
    }, 1750);
  }

  function copyFallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return copyFallback(text); }
      );
    }
    return Promise.resolve(copyFallback(text));
  }

  document.addEventListener('click', function (ev) {
    var el = ev.target.closest ? ev.target.closest('.click-copy') : null;
    if (!el) return;
    if (ev.target.closest('a')) return;

    var text = el.getAttribute('data-copy');
    if (text == null) {
      text = el.innerText != null ? el.innerText : el.textContent;
    }
    text = (text || '').replace(/\s+$/g, '').replace(/^\s+/g, '');
    if (!text) return;

    ev.preventDefault();

    Promise.resolve(copyText(text)).then(function (ok) {
      showPopup(ev.clientX, ev.clientY, ok ? 'copied~' : 'copy failed');
    });
  }, false);
})();
