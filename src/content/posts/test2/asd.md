---
title: Ciallo~
published: 2026-01-21
description: 内置Ciallo小恐龙游戏/排行榜
tags: [Test, Game]
category: Examples
draft: false
---
小恐龙游戏
---
点击窗口再空格开始游戏
---
<div style="text-align: center; font-size: 24px; font-weight: bold;">
  <span style="
    display: inline-block;
    animation: rotate 5s linear infinite, color-change 3s ease-in-out infinite;
  ">
    Ciallo~
  </span>
  <style>
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes color-change {
      0% { color: #ff0000; }
      50% { color: #00ff00; }
      100% { color: #0000ff; }
    }
  </style>
</div>
<b>
## 遊戲結束後可查看排行榜

<div id="iframe-container" style="width: 800px; margin: 20px auto; border: 2px solid #eee; border-radius: 8px; overflow: hidden;">
  <iframe 
    id="asd-iframe"
    src="/posts/test2/index.html"
    width="100%"
    frameborder="0"
    scrolling="no"
    style="border: none;"
    sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-storage-access-by-user-activation"
  ></iframe>
</div>

<div style="max-width: 800px; margin: 30px auto; padding: 20px; background: #f8f9fa; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
  <h3 style="margin: 0 0 16px; color: #333; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 12px;">
    🏆 歷史最高分排行
  </h3>

  <div id="leaderboard" style="min-height: 120px;">
    <table style="width:100%; border-collapse: collapse; font-size: 15px;">
      <thead>
        <tr style="background: #e9ecef; color: #495057;">
          <th style="padding: 12px 16px; text-align: left; font-weight: 600; border-radius: 6px 0 0 6px;">排名</th>
          <th style="padding: 12px 16px; text-align: right; font-weight: 600;">分數</th>
          <th style="padding: 12px 16px; text-align: right; font-weight: 600; border-radius: 0 6px 6px 0;">更新時間</th>
        </tr>
      </thead>
      <tbody id="score-list"></tbody>
    </table>
    <div id="no-record" style="text-align:center; padding: 40px 0; color: #868e96; font-size: 1.1em; display:none;">
      還沒有任何紀錄，快來挑戰最高分！
    </div>
  </div>

  <div style="margin-top: 16px; text-align: right;">
    <button id="clear-scores" style="padding: 8px 16px; font-size: 0.9em; color: #dc3545; background: white; border: 1px solid #dc3545; border-radius: 6px; cursor: pointer;">
      清除所有紀錄
    </button>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"></script>

<script>
// Supabase 配置（用你的）
const SUPABASE_URL = 'https://wwhjmnrmkzevetzsedgi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3aGptbnJta3pldmV0enNlZGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUwNDEsImV4cCI6MjA4NDU3MTA0MX0.KXNfp5-2MfxIRt5pPMWRe9EZUL_VUArn1XJ-OjpkJvg'; // 你的 key

let supabase = null;
if (window.supabase) {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase 初始化成功！');
  } catch (err) {
    console.error('Supabase 初始化失敗：', err);
  }
} else {
  console.error('Supabase SDK 載入失敗');
}

// 讀取排行榜
async function loadLeaderboard() {
  if (!supabase) return;

  const tbody = document.getElementById('score-list');
  const noRecord = document.getElementById('no-record');
  tbody.innerHTML = '';

  const { data, error } = await supabase
    .from('scores')
    .select('username, score, created_at')
    .order('score', { ascending: false })
    .limit(10);

  if (error) {
    console.error('讀取失敗', error);
    return;
  }

  if (!data || data.length === 0) {
    noRecord.style.display = 'block';
    return;
  }

  noRecord.style.display = 'none';

  data.forEach((item, index) => {
    const row = document.createElement('tr');
    const date = new Date(item.created_at).toLocaleString('zh-TW');
    row.innerHTML = `
      <td>${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1)}</td>
      <td style="text-align:right;font-weight:bold;">${item.username} - ${item.score.toLocaleString()}</td>
      <td style="text-align:right;color:#6c757d;">${date}</td>
    `;
    tbody.appendChild(row);
  });
}

// 父頁面接收遊戲死亡通知
window.onDinoDeath = function(score) {
  console.log('父頁面收到死亡通知！分數：', score);

  const username = prompt("请输入你的名字上排行榜（限10字）", "匿名玩家")?.trim().slice(0,10) || "匿名玩家";

  if (!supabase) {
    alert('Supabase 未初始化');
    return;
  }

  supabase
    .from('scores')
    .insert([{ username, score }])
    .then(({ error }) => {
      if (error) {
        console.error('提交失敗', error);
        alert('上传失败');
      } else {
        loadLeaderboard();
      }
    });
};

// 加載排行榜
window.addEventListener('load', loadLeaderboard);
document.getElementById('asd-iframe').onload = function() {
  try {
    const h = this.contentWindow.document.body.scrollHeight;
    if (h > 100) this.style.height = h + 'px';
  } catch(e) {}
  setTimeout(loadLeaderboard, 800);
};
</script>