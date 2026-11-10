/* Ajustes para celular, compartilhados por todas as telas do CRM (só valem em telas estreitas; no computador nada muda).
   1) Tabelas viram "cartões": cada linha mostra os rótulos das colunas e os botões de ação ficam sempre visíveis.
   2) O menu superior rola até a tela atual. */
(function () {
  var css = '@media (max-width:700px){'
    + '.tbl-wrap,.lx-scroll{overflow:visible!important}'
    + '.tbl,.lx-t{display:block!important;min-width:0!important;width:100%}'
    + '.tbl thead,.lx-t thead{display:none!important}'
    + '.tbl tbody,.lx-t tbody{display:block!important}'
    + '.tbl tr,.lx-t tr{display:block!important;border:1px solid var(--line,#E2E6EE);border-radius:10px;padding:6px 12px;margin:0 0 10px;background:var(--surface,#fff)}'
    + '.tbl tr:last-child,.lx-t tr:last-child{margin-bottom:0}'
    + '.tbl td,.lx-t td{display:flex!important;justify-content:space-between;align-items:center;gap:14px;padding:6px 0!important;border:0!important;text-align:right;background:none!important;min-width:0}'
    + '.tbl td[data-label]::before,.lx-t td[data-label]::before{content:attr(data-label);flex:none;color:var(--muted,#6B7690);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;text-align:left}'
    + '.tbl td.mb-act,.lx-t td.mb-act{justify-content:flex-end;flex-wrap:wrap;gap:6px;border-top:1px solid var(--line,#E2E6EE)!important;margin-top:4px;padding-top:10px!important;white-space:normal!important}'
    + '.tbl td.mb-act .btn,.lx-t td.mb-act .btn{margin-right:0!important}'
    + '.tbl td.mb-vazio,.lx-t td.mb-vazio{display:none!important}'
    + '.tbl td[colspan],.lx-t td[colspan]{display:block!important;text-align:center}'
    + '.lx-acts{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}'
    + '}';
  var st = document.createElement('style');
  st.setAttribute('data-mobile', '1');
  st.textContent = css;
  document.head.appendChild(st);

  function rotular() {
    var tabs = document.querySelectorAll('table.tbl, table.lx-t');
    for (var i = 0; i < tabs.length; i++) {
      var t = tabs[i];
      var ths = t.querySelectorAll('thead th');
      if (!ths.length) continue;
      var rows = t.querySelectorAll('tbody tr');
      for (var r = 0; r < rows.length; r++) {
        var tds = rows[r].children;
        if (tds.length !== ths.length) continue;   // linhas especiais (ex.: "nenhum resultado") ficam como estão
        for (var c = 0; c < tds.length; c++) {
          var td = tds[c];
          var nome = (ths[c].textContent || '').trim();
          if (nome) { if (td.getAttribute('data-label') !== nome) td.setAttribute('data-label', nome); }
          else if (!td.classList.contains('mb-act')) td.classList.add('mb-act');
          // células sem conteúdo ("—" ou vazias) ficam escondidas no cartão, para ele não ficar comprido
          var txt = (td.textContent || '').trim();
          var vazio = nome && (txt === '' || txt === '—') && !td.querySelector('button,input,a,select,svg,img');
          if (vazio) td.classList.add('mb-vazio'); else td.classList.remove('mb-vazio');
        }
      }
    }
  }
  var agendado = false;
  function agendar() {
    if (agendado) return;
    agendado = true;
    (window.requestAnimationFrame || setTimeout)(function () { agendado = false; try { rotular(); } catch (e) {} });
  }
  function menuAtual() {
    try {
      var a = document.querySelector('.nav .navi.active');
      if (a && a.scrollIntoView && window.innerWidth <= 820) a.scrollIntoView({inline: 'center', block: 'nearest'});
    } catch (e) {}
  }
  function iniciar() {
    new MutationObserver(agendar).observe(document.body, {childList: true, subtree: true});
    agendar();
    var tentativas = 0;
    var t = setInterval(function () { tentativas++; menuAtual(); if (document.querySelector('.nav .navi.active') || tentativas > 20) clearInterval(t); }, 300);
  }
  if (document.body) iniciar(); else document.addEventListener('DOMContentLoaded', iniciar);
})();
