import { roleService } from './services/RoleService';
import type { SlangMatch } from './services/RoleService';
import { factionService } from './services/FactionService';
import { taskService } from './services/TaskService';
import { strategyEngine } from './services/StrategyEngine';
import { TAG_LABELS, COMBOS, COUNTERS } from './data/roleTags';
import type { FactionType, DifficultyLevel, Role } from './types';

const app = document.getElementById('app')!;
const tabs = document.querySelectorAll('.tab');
let currentTab = 'roles';

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = (tab as HTMLElement).dataset.tab!;
    render();
  });
});

function badge(type: string, label: string): string {
  return `<span class="badge badge-${type}">${label}</span>`;
}

const factionLabel: Record<FactionType, string> = { goose: '鹅阵营', duck: '鸭阵营', neutral: '中立' };
const factionColor: Record<FactionType, string> = { goose: '#66bb6a', duck: '#ef5350', neutral: '#ffa726' };
const diffLabel: Record<DifficultyLevel, string> = { easy: '简单', medium: '中等', hard: '困难' };
const roleDiffLabel: Record<string, string> = { easy: '⭐ 简单', medium: '⭐⭐ 中等', hard: '⭐⭐⭐ 困难', very_hard: '⭐⭐⭐⭐ 极难' };

function getRoleName(id: string): string {
  const all = roleService.getAllRoles();
  const r = all.find(role => role.id === id);
  return r ? r.name : id;
}

function getColoredRoleName(id: string): string {
  const all = roleService.getAllRoles();
  const r = all.find(role => role.id === id);
  if (!r) return id;
  return `<span style="color:${factionColor[r.faction]}">${r.name}</span>`;
}

function collapsible(title: string, content: string, open = false): string {
  return `<details ${open ? 'open' : ''}><summary style="cursor:pointer;color:#e94560;font-weight:600;margin:8px 0 4px">${title}</summary><div style="padding-left:8px">${content}</div></details>`;
}

// ---- Roles Panel ----
function renderRoles(): string {
  let html = `<input class="search-box" id="roleSearch" placeholder="搜索角色（中文/英文/拼音/首字母）..." />`;
  html += `<div class="filter-row">
    <button class="filter-btn active" data-faction="all">全部</button>
    <button class="filter-btn" data-faction="goose">🦢 鹅阵营</button>
    <button class="filter-btn" data-faction="duck">🦆 鸭阵营</button>
    <button class="filter-btn" data-faction="neutral">⚖️ 中立</button>
  </div>`;
  html += `<div id="roleList"></div>`;
  return html;
}

function renderRoleCards(roles: Role[], query: string = ''): string {
  if (roles.length === 0) {
    let hint = `<div class="empty">未找到该角色</div>`;
    if (query) {
      const similar = roleService.getSimilarRoles(query);
      if (similar.length > 0) {
        hint += `<div class="similar-hint">你是不是在找：${similar.map(r =>
          `<a class="similar-link" data-name="${r.name}">${r.name}</a>`
        ).join('')}</div>`;
      }
    }
    return hint;
  }
  return roles.map(r => {
    const counterNames = (r.counterRoles || []).map(getColoredRoleName).join('、') || '无';
    const synergyNames = (r.synergyRoles || []).map(getColoredRoleName).join('、') || '无';

    const strategiesHtml = (r.commonStrategies || []).length > 0
      ? `<ul>${r.commonStrategies.map(s => `<li>${s}</li>`).join('')}</ul>` : '<div class="empty">暂无</div>';

    const precautionsHtml = (r.precautions || []).length > 0
      ? `<ul>${r.precautions.map(p => `<li>${p}</li>`).join('')}</ul>` : '<div class="empty">暂无</div>';

    const dialoguesHtml = (r.dialogues || []).length > 0
      ? `<ul>${r.dialogues.map(d => `<li>${d}</li>`).join('')}</ul>` : '<div class="empty">暂无</div>';

    const slangHtml = (r.slang || []).length > 0
      ? `<ul>${r.slang.map(s => `<li>${s}</li>`).join('')}</ul>` : '<div class="empty">暂无</div>';

    return `
    <div class="card">
      <div class="card-title"><span style="color:${factionColor[r.faction]}">${r.name}</span> <span style="color:#666;font-size:13px">${r.nameEn}</span></div>
      <div class="card-subtitle">
        ${badge(r.faction, factionLabel[r.faction])}
        ${(r.tags || []).map(t => { const info = TAG_LABELS[t]; return info ? `<span class="badge" style="background:${info.color}33;color:${info.color}">${info.icon} ${info.label}</span>` : ''; }).join('')}
        <span class="badge" style="background:#333;color:#ccc">${roleDiffLabel[r.difficulty] || r.difficulty}</span>
        ${r.isSeasonal ? '<span class="badge" style="background:#ff6f00;color:#fff">季节限定</span>' : ''}
        <span style="color:#666;font-size:12px;margin-left:4px">人气 ${r.popularity ?? '-'} · v${r.addedInVersion || '?'}</span>
      </div>
      <div class="card-body">
        <div><strong>技能：</strong>${r.skillDescription}</div>
        <div style="margin-top:4px"><strong>胜利条件：</strong>${r.winCondition || '-'}</div>
        <div style="margin-top:4px"><strong>使用建议：</strong>${r.usageTips}</div>
        <div style="margin-top:4px"><strong>克制：</strong>${counterNames} · <strong>配合：</strong>${synergyNames}</div>
        ${collapsible('📋 常用策略', strategiesHtml)}
        ${collapsible('⚠️ 注意事项', precautionsHtml)}
        ${collapsible('💬 常用话术', dialoguesHtml)}
        ${collapsible('🗣️ 黑话术语', slangHtml)}
      </div>
    </div>`;
  }).join('');
}

function bindRoleEvents() {
  const searchInput = document.getElementById('roleSearch') as HTMLInputElement;
  const filterBtns = document.querySelectorAll('.filter-btn');
  const roleList = document.getElementById('roleList')!;
  let currentFaction = 'all';

  function update() {
    const query = searchInput?.value.trim() || '';
    let roles = query ? roleService.searchByName(query) : roleService.getAllRoles();
    if (currentFaction !== 'all') {
      roles = roles.filter(r => r.faction === currentFaction);
    }
    roleList.innerHTML = renderRoleCards(roles, query);
    roleList.querySelectorAll('.similar-link').forEach(link => {
      link.addEventListener('click', () => {
        searchInput.value = (link as HTMLElement).dataset.name!;
        update();
      });
    });
  }

  searchInput?.addEventListener('input', update);
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFaction = (btn as HTMLElement).dataset.faction!;
      update();
    });
  });
  update();
}

// ---- Factions Panel ----
function renderFactions(): string {
  const factions: FactionType[] = ['goose', 'duck', 'neutral'];
  return factions.map(f => {
    const d = factionService.getFactionDetail(f);
    return `
      <div class="card">
        <div class="card-title">${badge(f, d.name)}</div>
        <div class="card-body">
          <div><strong>胜利条件：</strong>${d.winCondition}</div>
          <div style="margin-top:8px"><strong>玩法指南：</strong>${d.playstyleGuide}</div>
          <div style="margin-top:8px"><strong>注意事项：</strong></div>
          <ul>${d.warnings.map(w => `<li>${w}</li>`).join('')}</ul>
          <div style="margin-top:8px"><strong>新手建议：</strong></div>
          <ul>${d.beginnerTips.map(t => `<li>${t}</li>`).join('')}</ul>
        </div>
      </div>`;
  }).join('');
}

// ---- Tasks Panel ----
function renderTasks(): string {
  let html = `<input class="search-box" id="taskSearch" placeholder="搜索任务名称（中文/拼音）..." />`;
  html += `<div class="filter-row">
    <button class="filter-btn active" data-diff="all">全部</button>
    <button class="filter-btn" data-diff="easy">🟢 简单</button>
    <button class="filter-btn" data-diff="medium">🟡 中等</button>
    <button class="filter-btn" data-diff="hard">🔴 困难</button>
  </div>`;
  html += `<div id="taskList"></div>`;
  return html;
}

function renderTaskCards(tasks: ReturnType<typeof taskService.getAllTasks>): string {
  if (tasks.length === 0) return `<div class="empty">未找到该任务</div>`;
  return tasks.map(t => `
    <div class="card">
      <div class="card-title">${t.name} ${badge(t.difficulty, diffLabel[t.difficulty])}</div>
      <div class="card-body">
        <div><strong>位置：</strong>${t.mapLocation}</div>
        <div style="margin-top:6px"><strong>步骤：</strong></div>
        <ol style="padding-left:20px;margin-top:4px">${t.steps.map(s => `<li>${s}</li>`).join('')}</ol>
      </div>
    </div>
  `).join('');
}

function bindTaskEvents() {
  const searchInput = document.getElementById('taskSearch') as HTMLInputElement;
  const filterBtns = document.querySelectorAll('.filter-btn');
  const taskList = document.getElementById('taskList')!;
  let currentDiff = 'all';

  function update() {
    const query = searchInput?.value.trim() || '';
    let tasks = query ? taskService.searchByName(query) : taskService.getAllTasks();
    if (currentDiff !== 'all') {
      tasks = tasks.filter(t => t.difficulty === currentDiff);
    }
    taskList.innerHTML = renderTaskCards(tasks);
  }

  searchInput?.addEventListener('input', update);
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDiff = (btn as HTMLElement).dataset.diff!;
      update();
    });
  });
  update();
}

// ---- Strategies Panel ----
function renderStrategies(): string {
  let html = `<div class="filter-row">
    <button class="filter-btn active" data-level="all">全部</button>
    <button class="filter-btn" data-level="beginner">🌱 新手入门</button>
    <button class="filter-btn" data-level="advanced">🚀 进阶技巧</button>
  </div>`;
  html += `<div class="section-title">🦢 鹅阵营 — 识别鸭子技巧</div><div id="gooseTips"></div>`;
  html += `<div class="section-title">🦆 鸭阵营 — 伪装与破坏策略</div><div id="duckTips"></div>`;
  html += `<div class="section-title">🎭 角色专属策略</div><div id="roleTips"></div>`;
  return html;
}

function renderTipCards(tips: { title: string; content: string; level: string }[]): string {
  if (tips.length === 0) return `<div class="empty">暂无策略</div>`;
  return tips.map(t => `
    <div class="card">
      <div class="card-title">${t.title} ${badge(t.level, t.level === 'beginner' ? '新手' : '进阶')}</div>
      <div class="card-body">${t.content}</div>
    </div>
  `).join('');
}

function bindStrategyEvents() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentLevel = 'all';

  function update() {
    const gooseTips = strategyEngine.getGooseDetectionTips().filter(t => currentLevel === 'all' || t.level === currentLevel);
    const duckTips = strategyEngine.getDuckDisguiseTips().filter(t => currentLevel === 'all' || t.level === currentLevel);
    document.getElementById('gooseTips')!.innerHTML = renderTipCards(gooseTips);
    document.getElementById('duckTips')!.innerHTML = renderTipCards(duckTips);

    const roles = roleService.getAllRoles();
    let roleHtml = '';
    for (const role of roles) {
      const strategy = strategyEngine.getStrategyForRole(role.id);
      const tips = [...strategy.beginnerTips, ...strategy.advancedTips].filter(t => currentLevel === 'all' || t.level === currentLevel);
      if (tips.length > 0) {
        roleHtml += `<div style="margin-bottom:4px;color:${factionColor[role.faction]};font-weight:600;margin-top:12px">${role.name}</div>`;
        roleHtml += renderTipCards(tips);
      }
    }
    document.getElementById('roleTips')!.innerHTML = roleHtml || `<div class="empty">暂无策略</div>`;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLevel = (btn as HTMLElement).dataset.level!;
      update();
    });
  });
  update();
}

// ---- Slang Search Panel ----
function renderSlangSearch(): string {
  let html = `<input class="search-box" id="slangSearch" placeholder="输入黑话/术语/功能关键词，如：带刀好人、影帝、管道工..." />`;
  html += `<div style="color:#666;font-size:13px;margin-bottom:12px">支持搜索黑话术语、常用话术、策略关键词，反查对应角色</div>`;

  // Tag filter buttons
  html += `<div style="margin-bottom:8px;color:#aaa;font-size:13px">按功能分类筛选：</div>`;
  html += `<div class="filter-row" id="tagFilters">
    <button class="filter-btn active" data-tag="all">全部</button>
    <button class="filter-btn" data-tag="kill">🔪 击杀</button>
    <button class="filter-btn" data-tag="info">🔍 信息</button>
    <button class="filter-btn" data-tag="protect">🛡️ 保护</button>
    <button class="filter-btn" data-tag="disguise">🎭 伪装</button>
    <button class="filter-btn" data-tag="control">🔧 控制</button>
    <button class="filter-btn" data-tag="disrupt">💣 破坏</button>
    <button class="filter-btn" data-tag="special_win">🎯 特殊胜利</button>
    <button class="filter-btn" data-tag="utility">⚡ 功能辅助</button>
    <button class="filter-btn" data-tag="combos">🔄 强力组合</button>
    <button class="filter-btn" data-tag="counters">⚔️ 克制关系</button>
  </div>`;

  html += `<div id="slangHotwords" style="margin-bottom:12px"></div>`;
  html += `<div id="slangResults"></div>`;
  return html;
}

function renderTagResults(tag: string): string {
  const roles = roleService.filterByTag(tag);
  if (roles.length === 0) return `<div class="empty">该分类暂无角色</div>`;
  return roles.map(r => `
    <div class="card">
      <div class="card-title"><span style="color:${factionColor[r.faction]}">${r.name}</span> <span style="color:#666;font-size:13px">${r.nameEn}</span></div>
      <div class="card-subtitle">${badge(r.faction, factionLabel[r.faction])} ${(r.tags || []).map(t => {
        const info = TAG_LABELS[t];
        return info ? `<span class="badge" style="background:${info.color}33;color:${info.color}">${info.icon} ${info.label}</span>` : '';
      }).join('')}</div>
      <div class="card-body">
        <div><strong>技能：</strong>${r.skillDescription}</div>
        <div style="margin-top:4px"><strong>使用建议：</strong>${r.usageTips}</div>
      </div>
    </div>
  `).join('');
}

function renderCombos(): string {
  return COMBOS.map(c => {
    const fColor = c.faction === 'goose' ? '#66bb6a' : '#ef5350';
    const roleNames = c.roles.map(id => {
      const r = roleService.getAllRoles().find(role => role.id === id);
      return r ? `<span style="color:${factionColor[r.faction]}">${r.name}</span>` : id;
    }).join(' + ');
    return `
    <div class="card">
      <div class="card-title" style="color:${fColor}">${c.name}</div>
      <div class="card-subtitle">${roleNames}</div>
      <div class="card-body">${c.desc}</div>
    </div>`;
  }).join('');
}

function renderCounters(): string {
  return COUNTERS.map(c => {
    const atk = roleService.getAllRoles().find(r => r.id === c.attacker);
    const def = roleService.getAllRoles().find(r => r.id === c.defender);
    const atkName = atk ? `<span style="color:${factionColor[atk.faction]}">${atk.name}</span>` : c.attacker;
    const defName = def ? `<span style="color:${factionColor[def.faction]}">${def.name}</span>` : c.defender;
    return `
    <div class="card">
      <div class="card-title">${atkName} ⚔️ ${defName}</div>
      <div class="card-body">${c.desc}</div>
    </div>`;
  }).join('');
}

function renderSlangResults(matches: SlangMatch[]): string {
  if (matches.length === 0) return `<div class="empty">未找到匹配的角色，试试其他关键词</div>`;
  return matches.map(m => {
    const r = m.role;
    let matchHtml = '';
    if (m.matchedSlang.length > 0) {
      matchHtml += `<div style="margin-top:6px"><strong>🗣️ 匹配黑话：</strong></div><ul>${m.matchedSlang.map(s => `<li style="color:#ffcc80">${s}</li>`).join('')}</ul>`;
    }
    if (m.matchedDialogues.length > 0) {
      matchHtml += `<div style="margin-top:6px"><strong>💬 匹配话术：</strong></div><ul>${m.matchedDialogues.map(d => `<li style="color:#90caf9">${d}</li>`).join('')}</ul>`;
    }
    if (m.matchedStrategies.length > 0) {
      matchHtml += `<div style="margin-top:6px"><strong>📋 匹配策略：</strong></div><ul>${m.matchedStrategies.map(s => `<li style="color:#a5d6a7">${s}</li>`).join('')}</ul>`;
    }
    return `
    <div class="card">
      <div class="card-title"><span style="color:${factionColor[r.faction]}">${r.name}</span> <span style="color:#666;font-size:13px">${r.nameEn}</span></div>
      <div class="card-subtitle">${badge(r.faction, factionLabel[r.faction])}</div>
      <div class="card-body">
        <div><strong>技能：</strong>${r.skillDescription}</div>
        ${matchHtml}
      </div>
    </div>`;
  }).join('');
}

function bindSlangEvents() {
  const searchInput = document.getElementById('slangSearch') as HTMLInputElement;
  const results = document.getElementById('slangResults')!;
  const hotwords = document.getElementById('slangHotwords')!;
  const tagBtns = document.querySelectorAll('#tagFilters .filter-btn');
  let currentTag = 'all';

  const popularTerms = ['带刀好人', '影帝', '管道工', '报警鹅', '会议杀手', '隐形杀手', '双面间谍', '验尸官', '快刀手', '钓鱼执法'];
  hotwords.innerHTML = `<div class="filter-row">${popularTerms.map(t =>
    `<button class="filter-btn slang-hot" data-term="${t}">${t}</button>`
  ).join('')}</div>`;

  function update() {
    const query = searchInput?.value.trim() || '';

    // If a tag is selected (not 'all'), show tag results
    if (currentTag !== 'all' && !query) {
      if (currentTag === 'combos') {
        results.innerHTML = renderCombos();
      } else if (currentTag === 'counters') {
        results.innerHTML = renderCounters();
      } else {
        results.innerHTML = renderTagResults(currentTag);
      }
      return;
    }

    if (!query) {
      results.innerHTML = `<div class="empty">输入黑话术语开始搜索，或点击上方分类标签浏览</div>`;
      return;
    }

    // Text search — also filter by tag if one is selected
    let matches = roleService.searchBySlang(query);
    if (currentTag !== 'all' && currentTag !== 'combos' && currentTag !== 'counters') {
      matches = matches.filter(m => (m.role.tags || []).includes(currentTag));
    }
    results.innerHTML = renderSlangResults(matches);
  }

  searchInput?.addEventListener('input', update);

  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tagBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTag = (btn as HTMLElement).dataset.tag!;
      searchInput.value = '';  // 切换标签时清空搜索框
      update();
    });
  });

  hotwords.querySelectorAll('.slang-hot').forEach(btn => {
    btn.addEventListener('click', () => {
      searchInput.value = (btn as HTMLElement).dataset.term!;
      // Reset tag to 'all' when searching by text
      tagBtns.forEach(b => b.classList.remove('active'));
      tagBtns[0]?.classList.add('active');
      currentTag = 'all';
      update();
    });
  });
}

// ---- Main Render ----
function render() {
  switch (currentTab) {
    case 'roles':
      app.innerHTML = renderRoles();
      bindRoleEvents();
      break;
    case 'slang':
      app.innerHTML = renderSlangSearch();
      bindSlangEvents();
      break;
    case 'factions':
      app.innerHTML = renderFactions();
      break;
    case 'tasks':
      app.innerHTML = renderTasks();
      bindTaskEvents();
      break;
    case 'strategies':
      app.innerHTML = renderStrategies();
      bindStrategyEvents();
      break;
  }
}

render();
