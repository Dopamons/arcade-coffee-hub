/* 좁은 화면에서 표를 세로로 푼다.
   - 각 칸에 머리글 이름을 붙여 CSS가 "머리글 / 값" 으로 보여 준다
   - 첫 칸은 그 줄의 제목처럼 크게 (머리글 이름은 붙이지 않는다)
   - 값이 짧으면 "머리글 값" 한 줄로 붙인다 (# / 1 처럼 두 줄로 갈라지지 않게)
   폭이 넓어지면 원래 표로 돌아간다. */
(function () {
  // 이름을 붙이지 않는 머리글 — 붙여 봐야 의미가 없는 것들
  var SKIP = ['#', '번호', '순위', '추천', '사진', '예시', '코드', '',
              '예시 (작은잔 · 긴잔)', '사진 확인 수량'];

  function isShort(v) {
    return v.replace(/\s+/g, '').length <= 12;
  }

  function label() {
    document.querySelectorAll('table').forEach(function (t) {
      var ths = t.querySelectorAll('thead th');
      if (!ths.length) return;
      var names = Array.prototype.map.call(ths, function (th) {
        return th.textContent.replace(/\s+/g, ' ').trim();
      });

      t.querySelectorAll('tbody tr').forEach(function (tr) {
        var i = 0, first = true;
        Array.prototype.forEach.call(tr.children, function (td) {
          var span = td.colSpan || 1;
          var name = names[i] || '';
          var text = td.textContent.replace(/\s+/g, ' ').trim();

          if (span > 1) {
            td.setAttribute('data-full', '1');
          } else if (first) {
            // 줄의 첫 칸 = 그 줄의 제목
            td.setAttribute('data-first', '1');
            first = false;
          } else if (name && SKIP.indexOf(name) === -1) {
            td.setAttribute('data-label', name);
            if (isShort(text)) td.setAttribute('data-inline', '1');
          }
          i += span;
        });

        // 제목이 될 수 없는 칸(사진만 있거나 번호·배지처럼 짧은 것)은 넘기고
        // 실제로 이름이 적힌 칸을 그 줄의 제목으로 올린다
        for (var pass = 0; pass < 3; pass++) {
          var f = tr.querySelector('[data-first]');
          if (!f) break;
          var txt = f.textContent.replace(/\s+/g, '').trim();
          var next = f.nextElementSibling;
          if (txt.length > 3 || !next) break;   // 제목으로 쓸 만하면 그대로 둔다

          f.removeAttribute('data-first');
          f.setAttribute(txt ? 'data-tag' : 'data-media', '1');
          next.removeAttribute('data-label');
          next.removeAttribute('data-inline');
          next.setAttribute('data-first', '1');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', label);
  } else {
    label();
  }
})();
