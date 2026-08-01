/* 사진 팝업 — 클릭하면 크게 뜨고, 좌우로 넘겨 볼 수 있다.
   같은 data-gal 값을 가진 사진끼리 한 묶음으로 넘어간다.
   webp·png 파일은 링크로 열면 브라우저가 다운로드해 버려서 여기서 직접 띄운다. */
(function () {
  var box, imgEl, capEl, cntEl, list = [], idx = 0;

  function build() {
    box = document.createElement('div');
    box.className = 'lb';
    box.innerHTML =
      '<button class="lb-x" aria-label="닫기">닫기</button>' +
      '<button class="lb-nav lb-prev" aria-label="이전">‹</button>' +
      '<figure class="lb-fig"><img alt=""><figcaption><span class="lb-cap"></span>' +
      '<span class="lb-cnt"></span></figcaption></figure>' +
      '<button class="lb-nav lb-next" aria-label="다음">›</button>';
    document.body.appendChild(box);
    imgEl = box.querySelector('img');
    capEl = box.querySelector('.lb-cap');
    cntEl = box.querySelector('.lb-cnt');
    box.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    box.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    box.querySelector('.lb-x').addEventListener('click', close);
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lb-fig')) close();
    });
  }

  function show() {
    var el = list[idx];
    imgEl.src = el.getAttribute('src');
    imgEl.alt = el.alt || '';
    capEl.textContent = el.getAttribute('data-cap') || el.alt || '';
    cntEl.textContent = list.length > 1 ? (idx + 1) + ' / ' + list.length : '';
    var many = list.length > 1;
    box.querySelector('.lb-prev').style.display = many ? '' : 'none';
    box.querySelector('.lb-next').style.display = many ? '' : 'none';
  }

  function step(d) {
    if (!list.length) return;
    idx = (idx + d + list.length) % list.length;
    show();
  }

  function open(el) {
    if (!box) build();
    var gal = el.getAttribute('data-gal');
    list = gal
      ? Array.prototype.slice.call(document.querySelectorAll('[data-gal="' + gal + '"]'))
      : [el];
    idx = Math.max(0, list.indexOf(el));
    show();
    box.classList.add('on');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!box) return;
    box.classList.remove('on');
    imgEl.removeAttribute('src');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.tagName === 'IMG' && (t.classList.contains('thumb') || t.classList.contains('thumb-logo') || t.classList.contains('thumb-full') || t.closest('.shots'))) {
      e.preventDefault();
      open(t);
      return;
    }
    var a = t.closest && t.closest('a');
    if (a && /\.(webp|png|jpe?g)(\?|$)/i.test(a.getAttribute('href') || '')) {
      e.preventDefault();
      var inner = a.querySelector('img');
      if (inner) open(inner);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!box || !box.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
})();
