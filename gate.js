/* 簡易パスワードゲート（クライアント側の目隠し。本格的な保護ではありません） */
(function(){
  'use strict';
  var KEY  = 'nanairo_gate';
  var PASS = 'test_chat';

  // すでに認証済みなら何もしない
  try { if (sessionStorage.getItem(KEY) === 'ok') return; } catch(e){}

  var html = document.documentElement;
  html.style.overflow = 'hidden';

  var ov = document.createElement('div');
  ov.id = 'gate-overlay';
  ov.innerHTML =
    '<form class="gate-card" id="gate-form">' +
      '<p class="gate-brand">なないろ 子育て相談窓口</p>' +
      '<p class="gate-lead">関係者向けのデモページです。合言葉を入力してください。</p>' +
      '<input type="password" id="gate-input" class="gate-input" placeholder="合言葉" autocomplete="off" autofocus>' +
      '<button type="submit" class="gate-btn">開く</button>' +
      '<p class="gate-error" id="gate-error" hidden>合言葉が違います。もう一度お試しください。</p>' +
    '</form>';
  html.appendChild(ov);

  var form  = ov.querySelector('#gate-form');
  var input = ov.querySelector('#gate-input');
  var error = ov.querySelector('#gate-error');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (input.value === PASS){
      try { sessionStorage.setItem(KEY, 'ok'); } catch(err){}
      html.style.overflow = '';
      ov.remove();
    } else {
      error.hidden = false;
      input.value = '';
      input.focus();
    }
  });
})();
