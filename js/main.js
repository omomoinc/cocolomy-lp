/* ココロミー for Business LP（サービス名の合意は未確認。lp-changes-v2.md §4-A）
   - ヘッダーのスクロール時の影
   - スクロールで要素をふわっと表示
   - 問い合わせフォーム（ダミー送信：実際には送らず完了表示のみ） */

(function () {
  'use strict';

  // サービス名。ここが定義の場所（名称の合意は未確認。lp-changes-v2.md §4-A）。変えるときは、ここと HTML 内の「ココロミー for Business」を一括置換する
  // （HTMLにも同じ文字を入れてあるのは、JSが動かない環境や title・OGP でも表示するため）
  var SERVICE_NAME = 'ココロミー for Business';
  document.querySelectorAll('[data-service-name]').forEach(function (el) { el.textContent = SERVICE_NAME; });

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

  // サービス内容：項目にカーソルを合わせる（PC）／タップする（スマホ）と、画像と説明を表示
  // PC は常にどれか1つを表示。スマホはアコーディオンなので、開いている項目をもう一度タップすると閉じる
  var serviceBtns = Array.prototype.slice.call(document.querySelectorAll('.service-item__btn'));
  var pcLayout = window.matchMedia('(min-width: 960px)');
  var canHover = window.matchMedia('(hover: hover)');
  function showService(btn) {
    serviceBtns.forEach(function (b) {
      var on = b === btn;
      b.setAttribute('aria-expanded', on ? 'true' : 'false');
      document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
    });
  }
  if (serviceBtns.length) {
    showService(serviceBtns[0]);
    serviceBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        showService(isOpen && !pcLayout.matches ? null : btn);
      });
      btn.addEventListener('mouseenter', function () {
        if (pcLayout.matches && canHover.matches) showService(btn);
      });
    });
    // スマホで全部閉じた状態から PC 幅に広げたときは、最初の項目を表示する
    pcLayout.addEventListener('change', function () {
      var anyOpen = serviceBtns.some(function (b) { return b.getAttribute('aria-expanded') === 'true'; });
      if (pcLayout.matches && !anyOpen) showService(serviceBtns[0]);
    });
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
