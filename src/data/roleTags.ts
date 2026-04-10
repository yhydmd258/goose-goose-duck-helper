/**
 * 角色功能分类标签映射
 * 基于核心功能分类.md 和角色功能速查表.md
 */

export const TAG_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  kill: { label: '击杀', icon: '🔪', color: '#ef5350' },
  info: { label: '信息', icon: '🔍', color: '#42a5f5' },
  protect: { label: '保护', icon: '🛡️', color: '#66bb6a' },
  disguise: { label: '伪装', icon: '🎭', color: '#ab47bc' },
  control: { label: '控制', icon: '🔧', color: '#ffa726' },
  special_win: { label: '特殊胜利', icon: '🎯', color: '#ec407a' },
  utility: { label: '功能辅助', icon: '⚡', color: '#26c6da' },
  disrupt: { label: '破坏干扰', icon: '💣', color: '#ff7043' },
};

/**
 * 常见黑话/俗语 → 匹配的角色ID列表
 * 用于黑话搜索时直接匹配到对应角色
 */
export const SLANG_ROLE_MAP: Record<string, string[]> = {
  // 带刀好人系列
  '带刀好人': ['sheriff', 'vigilante', 'demon_hunter'],
  '带刀': ['sheriff', 'vigilante', 'demon_hunter'],
  '好人刀': ['sheriff', 'vigilante'],
  // 信息位
  '信息位': ['detective', 'medium', 'birdwatcher', 'coroner', 'tracker', 'voyeur'],
  '查人': ['detective', 'coroner'],
  '验人': ['detective'],
  '验尸': ['coroner'],
  // 保护位
  '保护位': ['canadian_goose', 'celebrity'],
  '报警': ['canadian_goose', 'celebrity'],
  '挡刀': ['canadian_goose'],
  // 伪装位
  '伪装': ['morphling', 'identity_thief', 'invisible', 'mimic'],
  '隐身': ['invisible'],
  // 控制位
  '控场': ['sorcerer', 'silencer', 'mute_duck', 'party_duck'],
  '禁言': ['silencer', 'mute_duck'],
  '封管道': ['sorcerer'],
  // 击杀方式
  '会议刀': ['assassin'],
  '猜身份': ['assassin'],
  '隐形杀': ['professional', 'invisible'],
  '管道杀': ['hitman'],
  '连杀': ['ninja', 'serial_killer'],
  // 尸体处理
  '吃尸体': ['cannibal', 'vulture'],
  '藏尸体': ['mystic', 'undertaker'],
  '拖尸体': ['undertaker'],
  '清尸': ['cannibal'],
  // 中立玩法
  '被投出': ['dodo', 'dueling_dodos'],
  '感染': ['pigeon'],
  '活到最后': ['falcon', 'raven'],
  '吞人': ['pelican'],
  // 恋人机制
  '恋人': ['lover_goose', 'matchmaker'],
  '绑定': ['lover_goose', 'matchmaker'],
  '链接': ['matchmaker'],
  '同生共死': ['lover_goose', 'matchmaker'],
  '命运共同体': ['lover_goose', 'matchmaker'],
  '红线': ['matchmaker'],
  '月老': ['matchmaker'],
  // 移动机制
  '管道': ['engineer', 'hitman', 'sorcerer'],
  '通风口': ['engineer', 'hitman', 'sorcerer'],
  '快速移动': ['engineer', 'hitman'],
  '开门': ['locksmith'],
  '开锁': ['locksmith'],
  // 死亡报警机制
  '自动报警': ['canadian_goose'],
  '死亡通知': ['celebrity', 'canadian_goose'],
  '全图报警': ['celebrity'],
  // 灵魂/鬼魂机制
  '鬼魂': ['medium', 'astral'],
  '灵魂出窍': ['astral'],
  '灵魂': ['astral', 'medium'],
  '透视': ['birdwatcher'],
  '看穿墙壁': ['birdwatcher'],
  // 投票机制
  '平票': ['politician'],
  '平票不死': ['politician'],
  '模仿投票': ['parrot'],
  // 环境免疫
  '免疫': ['adventurer'],
  '环境伤害': ['adventurer'],
  '岩浆': ['adventurer'],
  // 延迟击杀
  '流血': ['vampire'],
  '延迟死亡': ['vampire'],
  '慢杀': ['vampire'],
  // 炸弹机制
  '炸弹': ['demolitionist', 'sin_eater'],
  '爆炸': ['demolitionist', 'sin_eater'],
  // 变声/静音
  '变声': ['party_duck'],
  '静音': ['silencer', 'mute_duck'],
  // 赏金机制
  '赏金': ['gravy'],
  '赚钱': ['gravy'],
  // 成长机制
  '成长': ['dinosaur'],
  '无敌': ['dinosaur'],
  // 变身机制
  '变身': ['morphling', 'identity_thief', 'wolf'],
  '夜间': ['wolf'],
  '变形': ['morphling', 'identity_thief'],
  // 特殊地图
  '雪地': ['snowman'],
  // 追踪
  '追踪': ['tracker'],
  '轨迹': ['tracker'],
  // 卧底
  '卧底': ['mimic'],
  '双面': ['mimic'],
  '间谍': ['spy', 'mimic'],
};

/** roleId → tags */
export const ROLE_TAGS: Record<string, string[]> = {
  // 鹅 - 击杀
  sheriff: ['kill'],
  vigilante: ['kill'],
  bodyguard: ['kill', 'protect'],
  avenger: ['kill'],
  // 鹅 - 信息
  detective: ['info'],
  medium: ['info'],
  birdwatcher: ['info'],
  coroner: ['info'],
  tracker: ['info'],
  voyeur: ['info'],
  // 鹅 - 保护
  canadian_goose: ['protect'],
  celebrity: ['protect'],
  // 鹅 - 功能辅助
  goose: ['utility'],
  engineer: ['utility'],
  adventurer: ['utility'],
  politician: ['utility'],
  locksmith: ['utility'],
  technician: ['utility'],
  mimic: ['disguise', 'info'],
  astral: ['info', 'utility'],
  gravy: ['utility'],
  lover_goose: ['utility'],
  demon_hunter: ['kill', 'utility'],
  street_urchin: ['utility'],
  matchmaker: ['control', 'utility'],

  // 鸭 - 击杀
  duck: ['kill'],
  assassin: ['kill', 'info'],
  professional: ['kill', 'disrupt'],
  silencer: ['kill', 'control'],
  morphling: ['kill', 'disguise'],
  hitman: ['kill'],
  ninja: ['kill'],
  vampire: ['kill'],
  serial_killer: ['kill'],
  // 鸭 - 伪装
  identity_thief: ['disguise', 'kill'],
  invisible: ['disguise'],
  // 鸭 - 控制
  sorcerer: ['control'],
  mute_duck: ['control'],
  party_duck: ['control'],
  // 鸭 - 信息
  spy: ['info'],
  informer: ['info'],
  // 鸭 - 破坏干扰
  cannibal: ['disrupt'],
  mystic: ['disrupt'],
  undertaker: ['disrupt'],
  demolitionist: ['disrupt'],
  ghost_duck: ['disrupt'],
  sin_eater: ['disrupt'],
  high_priest: ['control', 'disrupt'],

  // 中立 - 特殊胜利
  dodo: ['special_win'],
  dueling_dodos: ['special_win'],
  pigeon: ['special_win'],
  vulture: ['special_win'],
  raven: ['special_win'],
  pelican: ['kill', 'special_win'],
  falcon: ['kill', 'special_win'],
  parrot: ['utility', 'special_win'],
  dinosaur: ['kill', 'special_win'],
  wolf: ['kill', 'special_win'],
  snowman: ['utility', 'special_win'],
};

/** 强力组合 */
export const COMBOS = [
  { name: '警长 + 加拿大鹅', roles: ['sheriff', 'canadian_goose'], desc: '警长击杀可疑目标，加拿大鹅死亡自动报警提供信息', faction: 'goose' },
  { name: '侦探 + 通灵者', roles: ['detective', 'medium'], desc: '侦探调查活人，通灵者与死者交流，信息全覆盖', faction: 'goose' },
  { name: '工程师 + 锁匠', roles: ['engineer', 'locksmith'], desc: '工程师快速移动，锁匠开门，团队机动性最大化', faction: 'goose' },
  { name: '专业杀手 + 食人族', roles: ['professional', 'cannibal'], desc: '专业杀人不留尸体，食人族吃掉残余证据，完美隐藏', faction: 'duck' },
  { name: '刺客 + 间谍', roles: ['assassin', 'spy'], desc: '间谍获取角色信息，刺客会议中精准击杀', faction: 'duck' },
  { name: '术士 + 静音鸭', roles: ['sorcerer', 'silencer'], desc: '术士封锁管道限制移动，静音鸭禁言关键玩家', faction: 'duck' },
];

/** 克制关系 */
export const COUNTERS = [
  { attacker: 'sorcerer', defender: 'engineer', desc: '术士关闭管道克制工程师的快速移动' },
  { attacker: 'professional', defender: 'canadian_goose', desc: '专业杀手不留尸体绕过加拿大鹅的自动报警' },
  { attacker: 'morphling', defender: 'detective', desc: '变形者伪装可以迷惑侦探的调查' },
  { attacker: 'assassin', defender: 'bodyguard', desc: '刺客会议击杀绕过保镖的物理保护' },
];
