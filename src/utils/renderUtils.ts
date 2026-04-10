import { Role } from '../types';

export class RenderUtils {
  static getFactionIcon(faction: string): string {
    switch (faction) {
      case 'goose': return '🦢';
      case 'duck': return '🦆';
      case 'neutral': return '⚖️';
      default: return '❓';
    }
  }

  static getFactionName(faction: string): string {
    switch (faction) {
      case 'goose': return '鹅阵营';
      case 'duck': return '鸭阵营';
      case 'neutral': return '中立阵营';
      default: return '未知阵营';
    }
  }

  static getDifficultyName(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      case 'very_hard': return '极难';
      default: return '未知';
    }
  }

  static getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return '#2e7d32';
      case 'medium': return '#f57c00';
      case 'hard': return '#d32f2f';
      case 'very_hard': return '#6a1b9a';
      default: return '#666';
    }
  }

  static getFactionColor(faction: string): string {
    switch (faction) {
      case 'goose': return '#1b5e20';
      case 'duck': return '#b71c1c';
      case 'neutral': return '#e65100';
      default: return '#666';
    }
  }

  static renderRoleCard(role: Role): string {
    const factionIcon = this.getFactionIcon(role.faction);
    const factionName = this.getFactionName(role.faction);
    const difficultyName = this.getDifficultyName(role.difficulty);
    
    return `
      <div class="card" data-role-id="${role.id}">
        <div class="card-header">
          <div>
            <div class="card-title">
              <span class="faction-icon">${factionIcon}</span>
              ${role.name}
              <span class="difficulty-indicator">
                <span class="difficulty-dot" style="background: ${this.getDifficultyColor(role.difficulty)}"></span>
                <span class="badge" style="background: ${this.getDifficultyColor(role.difficulty)}; color: white">
                  ${difficultyName}
                </span>
              </span>
            </div>
            <div class="card-subtitle">${role.nameEn}</div>
          </div>
          <span class="badge" style="background: ${this.getFactionColor(role.faction)}; color: white">
            ${factionName}
          </span>
        </div>
        
        <div class="card-body">
          <div class="section">
            <div class="section-title">🎯 技能描述</div>
            <p>${role.skillDescription}</p>
          </div>
          
          <div class="section">
            <div class="section-title">📝 使用建议</div>
            <p>${role.usageTips}</p>
          </div>
          
          <div class="section">
            <div class="section-title">🏆 胜利条件</div>
            <p>${role.winCondition}</p>
          </div>
          
          ${role.commonStrategies && role.commonStrategies.length > 0 ? `
          <div class="section">
            <div class="section-title">🎮 常用策略</div>
            <ul class="info-list">
              ${role.commonStrategies.map(strategy => `<li>${strategy}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
          ${role.precautions && role.precautions.length > 0 ? `
          <div class="section">
            <div class="section-title">⚠️ 注意事项</div>
            <ul class="info-list">
              ${role.precautions.map(precaution => `<li>${precaution}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
          ${role.dialogues && role.dialogues.length > 0 ? `
          <div class="section">
            <div class="section-title">💬 常用说辞</div>
            <ul class="info-list">
              ${role.dialogues.map(dialogue => `<li>${dialogue}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
          ${role.slang && role.slang.length > 0 ? `
          <div class="section">
            <div class="section-title">🔤 俗语黑话</div>
            <div class="tag-cloud">
              ${role.slang.map(slang => `<span class="tag">${slang}</span>`).join('')}
            </div>
          </div>
          ` : ''}
          
          <div class="section">
            <div class="section-title">📊 角色信息</div>
            <div style="display: flex; gap: 12px; font-size: 12px; color: #888;">
              <span>版本: ${role.addedInVersion || '1.0'}</span>
              <span>热度: ${role.popularity || 50}/100</span>
              ${role.isSeasonal ? '<span>🎄 季节性角色</span>' : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static renderEmptyState(message: string = '未找到匹配的角色'): string {
    return `
      <div class="empty">
        <div class="empty-icon">🔍</div>
        <h3>${message}</h3>
        <p>尝试使用其他关键词或调整筛选条件</p>
      </div>
    `;
  }

  static renderStats(total: number, goose: number, duck: number, neutral: number): string {
    return `
      <div class="stats">
        <div class="stat-item">🦢 鹅阵营: ${goose}个角色</div>
        <div class="stat-item">🦆 鸭阵营: ${duck}个角色</div>
        <div class="stat-item">⚖️ 中立阵营: ${neutral}个角色</div>
        <div class="stat-item">📊 总计: ${total}个角色</div>
      </div>
    `;
  }
}