/* ココロミー企業パートナー LP
   - ヘッダーのスクロール時の影
   - スクロールで要素をふわっと表示
   - 問い合わせフォーム（ダミー送信：実際には送らず完了表示のみ） */

(function () {
  'use strict';

  // ヘッダー：少しスクロールしたら影をつける
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // スクロールアニメーション
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // 問い合わせフォーム（ダミー）
  // TODO: 送信方式が決まったら（Formspree / Googleフォーム等）ここを差し替える。サーバー側コードは書かない。
  var form = document.getElementById('contact-form');
  var done = document.getElementById('form-done');
  if (!form) return;

  var required = [
    { id: 'f-company', test: function (v) { return v.trim() !== ''; } },
    { id: 'f-name', test: function (v) { return v.trim() !== ''; } },
    { id: 'f-email', test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); } }
  ];

  function validateField(rule) {
    var input = document.getElementById(rule.id);
    var error = document.getElementById(rule.id + '-error');
    var ok = rule.test(input.value);
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (ok) {
      input.removeAttribute('aria-describedby');
    } else {
      input.setAttribute('aria-describedby', error.id);
    }
    error.hidden = ok;
    return ok;
  }

  required.forEach(function (rule) {
    document.getElementById(rule.id).addEventListener('blur', function () {
      if (this.value !== '') validateField(rule);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    required.forEach(function (rule) {
      if (!validateField(rule) && !firstInvalid) firstInvalid = document.getElementById(rule.id);
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    form.hidden = true;
    done.hidden = false;
    done.focus();
  });
})();
