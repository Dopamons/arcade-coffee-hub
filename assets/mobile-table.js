/* 좁은 화면에서 표를 세로로 푼다.
   각 칸에 머리글 이름을 붙여 두면 CSS가 "머리글 / 값" 두 줄로 보여 준다.
   폭이 넓어지면 원래 표로 돌아간다. */
(function () {
  function label() {
    document.querySelectorAll('table').forEach(function (t) {
      var ths = t.querySelectorAll('thead th');
      if (!ths.length) return;
      var names = Array.prototype.map.call(ths, function (th) {
        return th.textContent.replace(/\s+/g, ' ').trim();
      });
      t.querySelectorAll('tbody tr').forEach(function (tr) {
        var i = 0;
        Array.prototype.forEach.call(tr.children, function (td) {
          var span = td.colSpan || 1;
          if (span > 1) {
            td.setAttribute('data-full', '1');
          } else if (names[i]) {
            td.setAttribute('data-label', names[i]);
          }
          i += span;
        });
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', label);
  } else {
    label();
  }
})();
