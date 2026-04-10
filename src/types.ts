// 阵营类型
export type FactionType = 'goose' | 'duck' | 'neutral';

// 难度等级
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// 策略层级
export type StrategyLevel = 'beginner' | 'advanced';

// 角色
export interface Role {
  id: string;
  name: string;           // 角色名称（中文）
  nameEn: string;         // 角色名称（英文）
  faction: FactionType;   // 所属阵营
  skillDescription: string; // 技能描述
  usageTips: string;      // 使用建议
  difficulty: 'easy' | 'medium' | 'hard' | 'very_hard'; // 上手难度
  winCondition: string;   // 胜利条件
  commonStrategies: string[]; // 常用玩法策略
  precautions: string[];  // 注意事项
  dialogues: string[];    // 常用说辞/对话
  slang: string[];        // 俗语/黑话
  counterRoles: string[]; // 克制角色ID
  synergyRoles: string[]; // 配合角色ID
  addedInVersion: string; // 添加版本
  isSeasonal: boolean;    // 是否为季节性角色
  popularity: number;     // 受欢迎程度 0-100
  tags?: string[];        // 功能分类标签
}

// 阵营详情
export interface FactionDetail {
  type: FactionType;
  name: string;              // 阵营名称
  winCondition: string;      // 胜利条件
  playstyleGuide: string;    // 基本玩法指南
  warnings: string[];        // 注意事项
  beginnerTips: string[];    // 新手建议（至少 3 条）
}

// 阵营（简要信息）
export interface Faction {
  type: FactionType;
  name: string;
  winCondition: string;
}

// 游戏任务
export interface GameTask {
  id: string;
  name: string;              // 任务名称
  difficulty: DifficultyLevel; // 难度等级
  steps: string[];           // 完成步骤
  mapLocation: string;       // 所在地图位置
}

// 角色策略
export interface RoleStrategy {
  roleId: string;
  beginnerTips: StrategyTip[];  // 新手入门策略
  advancedTips: StrategyTip[];  // 进阶技巧
}

// 策略建议条目
export interface StrategyTip {
  title: string;
  content: string;
  level: StrategyLevel;
}
