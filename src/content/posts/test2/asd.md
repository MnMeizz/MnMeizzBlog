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
    /* 弹窗样式提前定义，避免样式加载延迟 */
    #name-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
      justify-content: center;
      align-items: center;
    }
  </style>
</div>

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

<!-- 自定义名字输入弹窗（默认隐藏） -->
<div id="name-modal">
  <div style="width: 90%; max-width: 400px; background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
    <h3 style="margin: 0 0 16px; color: #333; font-size: 1.2em; text-align: center;">
      🎮 恭喜！提交你的分数
    </h3>
    <p style="color: #6c757d; margin: 0 0 20px; text-align: center;">
      输入你的名字（限10字），登上排行榜吧！
    </p>
    <input 
      type="text" 
      id="username-input" 
      maxlength="10"
      placeholder="匿名玩家" 
      style="width: 100%; padding: 12px 16px; border: 2px solid #eee; border-radius: 8px; font-size: 1em; margin-bottom: 20px; box-sizing: border-box;"
    >
    <div style="display: flex; gap: 12px; justify-content: center;">
      <button id="cancel-btn" style="padding: 10px 24px; font-size: 1em; color: #6c757d; background: #f8f9fa; border: 1px solid #eee; border-radius: 8px; cursor: pointer; flex: 1;">
        取消
      </button>
      <button id="confirm-btn" style="padding: 10px 24px; font-size: 1em; color: white; background: #007bff; border: none; border-radius: 8px; cursor: pointer; flex: 1;">
        确认提交
      </button>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"></script>

<script>
// Supabase 配置
const SUPABASE_URL = 'https://wwhjmnrmkzevetzsedgi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3aGptbnJta3pldmV0enNlZGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUwNDEsImV4cCI6MjA4NDU3MTA0MX0.KXNfp5-2MfxIRt5pPMWRe9EZUL_VUArn1XJ-OjpkJvg';

let supabase = null;
let currentScore = 0; // 存储当前游戏分数
// 获取DOM元素
const nameModal = document.getElementById('name-modal');
const usernameInput = document.getElementById('username-input');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');
const clearScoresBtn = document.getElementById('clear-scores');

// 初始化Supabase
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
    .limit(5);

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

// 打开自定义弹窗
function openNameModal(score) {
  currentScore = score;
  usernameInput.value = '匿名玩家'; // 默认值
  nameModal.style.display = 'flex';
  usernameInput.focus(); // 自动聚焦输入框
}

// 关闭自定义弹窗
function closeNameModal() {
  nameModal.style.display = 'none';
  currentScore = 0;
}

// 提交分数逻辑
async function submitScore() {
  if (!supabase) {
    alert('Supabase 未初始化，无法提交分数');
    closeNameModal();
    return;
  }

  // 处理用户名（去空格、限10字、默认匿名）
  const username = usernameInput.value.trim().slice(0, 10) || '匿名玩家';
  
  const { error } = await supabase
    .from('scores')
    .insert([{ username, score: currentScore }]);

  if (error) {
    console.error('提交失敗', error);
    alert('分数上传失败，请重试！');
  } else {
    loadLeaderboard(); // 刷新排行榜
    alert('分数提交成功！');
  }
  closeNameModal();
}

// 父頁面接收遊戲死亡通知（替换原生prompt）
window.onDinoDeath = function(score) {
  console.log('父頁面收到死亡通知！分數：', score);
  openNameModal(score); // 打开自定义弹窗
};

// 绑定弹窗按钮事件
cancelBtn.addEventListener('click', closeNameModal);
confirmBtn.addEventListener('click', submitScore);

// 绑定清除记录按钮事件
clearScoresBtn.addEventListener('click', async () => {
  if (!confirm('确定要清除所有排行榜记录吗？此操作不可恢复！')) return;
  if (!supabase) {
    alert('Supabase 未初始化，无法清除记录');
    return;
  }

  const { error } = await supabase
    .from('scores')
    .delete()
    .neq('id', 0); // 匹配所有记录（id不为0，实际是全删）

  if (error) {
    console.error('清除失敗', error);
    alert('记录清除失败，请重试！');
  } else {
    loadLeaderboard(); // 刷新排行榜
    alert('所有记录已成功清除！');
  }
});

// iframe加载完成后调整高度+加载排行榜（只执行一次）
document.getElementById('asd-iframe').onload = function() {
  try {
    const h = this.contentWindow.document.body.scrollHeight;
    if (h > 100) this.style.height = h + 'px';
  } catch(e) {
    console.error('调整iframe高度失败：', e);
  }
  loadLeaderboard();
};

// 按ESC键关闭弹窗（优化体验）
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nameModal.style.display === 'flex') {
    closeNameModal();
  }
});
</script>