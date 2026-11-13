(function () {
  // Mobile menu
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Schedule: grey out played games, highlight the next one, and show it in the top banner.
  var games = Array.prototype.slice.call(document.querySelectorAll('.game[data-date]'));
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var next = null;
  games.forEach(function (g) {
    var p = g.getAttribute('data-date').split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    if (d < today) g.classList.add('played');
    else if (!next) { next = { el: g, date: d }; }
  });
  if (next) {
    next.el.classList.add('next');
    var bar = document.getElementById('nextGame');
    var txt = document.getElementById('nextGameText');
    var days = Math.round((next.date - today) / 86400000);
    var when = days === 0 ? 'Tonight' : days === 1 ? 'Tomorrow' : next.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    var home = next.el.getAttribute('data-home') === '1';
    if (bar && txt) {
      txt.innerHTML = '<strong>Next game:</strong> ' + when + ' · ' + (home ? 'vs ' : 'at ') + next.el.getAttribute('data-opp') + (home ? ' · Home' : '');
      bar.hidden = false;
    }
  }

  // Links that preselect a program on the form
  var select = document.getElementById('programSelect');
  document.querySelectorAll('[data-program]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (select) select.value = a.getAttribute('data-program');
    });
  });

  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Reveal on scroll
  var targets = document.querySelectorAll('.bout:not(.game), .quote, .board, .inventory li, .coach-mark, .coach-copy, .fb-frame, .flyer, .visit');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (t) { t.classList.add('reveal'); io.observe(t); });
  }

  // Get-involved form
  var form = document.getElementById('joinForm');
  var msg = document.getElementById('formMsg');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = Object.fromEntries(new FormData(form).entries());
      msg.className = 'form-msg';
      if (!data.name || !data.name.trim()) { msg.textContent = 'Please add your name.'; msg.classList.add('err'); return; }
      if (!data.phone && !data.email) { msg.textContent = 'Add a phone or email so we can reach you.'; msg.classList.add('err'); return; }
      var submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      submit.textContent = 'Sending…';
      fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.j.error || 'Something went wrong.');
          form.reset();
          msg.textContent = "Got it, thanks! The team will reach out soon. Go Scots!";
          msg.classList.add('ok');
        })
        .catch(function (err) {
          msg.textContent = err.message + ' Or email bonnyeaglebasketball@gmail.com.';
          msg.classList.add('err');
        })
        .finally(function () {
          submit.disabled = false;
          submit.textContent = 'Count Me In';
        });
    });
  }
})();
