'use strict';

/* ===== 要素 ===== */
const app         = document.getElementById('app');
const sidebar     = document.getElementById('sidebar');
const sidebarClose= document.getElementById('sidebarClose');
const menuBtn     = document.getElementById('menuBtn');
const messages    = document.getElementById('messages');
const phoneScreen = document.getElementById('phoneScreen');
const startBar    = document.getElementById('startBar');
const startBtn    = document.getElementById('startBtn');
const composer    = document.getElementById('composer');
const msgInput    = document.getElementById('msgInput');
const sendBtn     = document.getElementById('sendBtn');

/* ===== 状態 ===== */
let chatting   = false;
let replyIndex = 0;
let idleTimer  = null;
let ward = '', school = '';
const IDLE_MS  = 5 * 60 * 1000; // 5分

const WARDS   = ['あおば区','みどり区','ひがし区','にし区','その他・答えたくない'];
const SCHOOLS = ['未就学','小学校','中学校','高校'];

/* ===== 緊急ワード ===== */
const EMERGENCY_WORDS = ['死にたい','死ぬ','しにたい','消えたい','きえたい','自殺','いなくなりたい','リストカット','殺して'];

/* ===== 寄り添い定型メッセージ ===== */
const AI_REPLIES = [
  'お話ししてくださって、ありがとうございます。まずは、ここまでよく頑張ってこられましたね。どんなことが、いちばん気にかかっていますか。',
  'そう感じるのは、とても自然なことだと思います。無理にまとめようとしなくて大丈夫ですよ。よかったら、もう少し聞かせてください。',
  'それは、しんどい状況ですね。ひとりで抱えてこられたのだとしたら、本当に大変だったと思います。',
  'あなたのペースで大丈夫です。うまく言葉にならなくても、感じていることをそのまま置いていってくださいね。',
  'お子さんのことを、それだけ真剣に考えていらっしゃるのが伝わってきます。その気持ちは、きっと届いていますよ。',
  'ここでは、良い悪いをジャッジすることはありません。あなたの感じ方を、そのまま大切にしたいと思っています。'
];

/* ===== サイドバー開閉 ===== */
if (window.matchMedia('(max-width:860px)').matches) app.classList.add('sidebar-hidden');
sidebarClose.addEventListener('click', () => app.classList.add('sidebar-hidden'));
menuBtn.addEventListener('click', () => app.classList.remove('sidebar-hidden'));

/* ===== 時刻フォーマット ===== */
function nowStamp(){
  const d = new Date();
  const p = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/* ===== 描画ヘルパー ===== */
function addAI(text, options){
  const row = document.createElement('div');
  row.className = 'row ai';

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.innerHTML = '<span class="a1">な</span><span class="a2">な</span><span class="a3">い</span><span class="a4">ろ</span>';

  const group = document.createElement('div');
  group.className = 'group';

  const bubble = document.createElement('div');
  bubble.className = 'bubble ai';
  bubble.textContent = text;
  group.appendChild(bubble);

  if (options && options.length){
    const opts = document.createElement('div');
    opts.className = 'options';
    options.forEach(o => {
      const b = document.createElement('button');
      b.className = 'opt-btn';
      b.textContent = o.label;
      b.addEventListener('click', () => {
        opts.querySelectorAll('.opt-btn').forEach(x => x.disabled = true);
        o.onClick(o.label);
      });
      opts.appendChild(b);
    });
    group.appendChild(opts);
  }

  const time = document.createElement('div');
  time.className = 'time';
  time.textContent = nowStamp();
  group.appendChild(time);

  row.appendChild(avatar);
  row.appendChild(group);
  messages.appendChild(row);
  scrollBottom();
}

function addUser(text){
  const row = document.createElement('div');
  row.className = 'row me';
  const group = document.createElement('div');
  group.className = 'group';
  const bubble = document.createElement('div');
  bubble.className = 'bubble me';
  bubble.textContent = text;
  const time = document.createElement('div');
  time.className = 'time';
  time.textContent = nowStamp();
  group.appendChild(bubble);
  group.appendChild(time);
  row.appendChild(group);
  messages.appendChild(row);
  scrollBottom();
}

function addAlert(){
  const row = document.createElement('div');
  row.className = 'row ai';
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.innerHTML = '<span class="a1">な</span><span class="a2">な</span><span class="a3">い</span><span class="a4">ろ</span>';
  const group = document.createElement('div');
  group.className = 'group';
  const bubble = document.createElement('div');
  bubble.className = 'bubble alert';
  bubble.innerHTML =
    '<strong>あなたのことが、とても心配です。</strong><br>' +
    'いま、つらい気持ちが強くなっていませんか。ひとりで抱えず、専門の相談員に話してみてください。（下記はサンプル表示です）<br>' +
    '<span class="alert-num">いのちの電話　0120-783-556</span><br>' +
    '緊急のときは <strong>110 / 119</strong> へご連絡ください。';
  const time = document.createElement('div');
  time.className = 'time';
  time.textContent = nowStamp();
  group.appendChild(bubble);
  group.appendChild(time);
  row.appendChild(avatar);
  row.appendChild(group);
  messages.appendChild(row);
  scrollBottom();
}

function scrollBottom(){
  phoneScreen.scrollTop = phoneScreen.scrollHeight;
}

/* ===== オンボーディング（選択肢会話） ===== */
startBtn.addEventListener('click', () => {
  startBar.hidden = true;
  addAI('こんにちは。「なないろ」です。ここは、あなたの気持ちをそっと聞く場所です。はじめる前に、2つ教えてください。');
  setTimeout(askWard, 500);
});

function askWard(){
  addAI('お住まいの区を選んでください。', WARDS.map(w => ({
    label: w,
    onClick: (label) => { ward = label; addUser(label); setTimeout(askSchool, 400); }
  })));
}

function askSchool(){
  addAI('ありがとうございます。お子さんの校種を選んでください。', SCHOOLS.map(s => ({
    label: s,
    onClick: (label) => { school = label; addUser(label); setTimeout(askConsent, 400); }
  })));
}

function askConsent(){
  addAI(
    '最後の送信から5分で相談は自動的に終了します。個人を特定できる情報の入力はお控えください。返答するのはAIです。この内容に同意して相談を始めますか？',
    [
      { label: '同意して開始', onClick: () => { addUser('同意して開始'); setTimeout(beginChat, 400); } },
      { label: '今は相談しない', onClick: () => { addUser('今は相談しない'); setTimeout(declineChat, 400); } }
    ]
  );
}

function beginChat(){
  chatting = true;
  composer.hidden = false;
  msgInput.focus();
  addAI(`${ward}・${school}でお受けします。今日は、どんなことをお話ししたい気分ですか。ゆっくりで大丈夫ですよ。`);
  resetIdle();
}

function declineChat(){
  addAI('承知しました。話したくなったら、いつでも戻ってきてくださいね。あなたのことを気にかけています。');
  startBar.hidden = false;
}

/* ===== 送信 ===== */
function handleSend(){
  const text = msgInput.value.trim();
  if (!text || !chatting) return;
  addUser(text);
  msgInput.value = '';
  resetIdle();

  if (EMERGENCY_WORDS.some(w => text.includes(w))){
    setTimeout(addAlert, 450);
    return;
  }
  setTimeout(() => {
    addAI(AI_REPLIES[replyIndex % AI_REPLIES.length]);
    replyIndex++;
  }, 650);
}

sendBtn.addEventListener('click', handleSend);
msgInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing){ e.preventDefault(); handleSend(); }
});

/* ===== 5分アイドルで自動終了 ===== */
function resetIdle(){
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(endSession, IDLE_MS);
}
function endSession(){
  if (!chatting) return;
  chatting = false;
  msgInput.disabled = true;
  sendBtn.disabled = true;
  msgInput.placeholder = '相談は終了しました';
  addAI('5分間やりとりがなかったため、相談を終了しました。またいつでもお越しください。');
}
