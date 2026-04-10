import { Role } from '../types';
import gooseRoles1 from '../data/complete_roles.json';
import gooseRoles2 from '../data/goose_roles_part2.json';
import duckRoles1 from '../data/duck_roles.json';
import duckRoles2 from '../data/duck_roles_part2.json';
import neutralRoles from '../data/neutral_roles.json';
import { writeFileSync } from 'fs';
import { join } from 'path';

// 合并所有角色数据
const allRoles: Role[] = [
  ...gooseRoles1 as Role[],
  ...gooseRoles2 as Role[],
  ...duckRoles1 as Role[],
  ...duckRoles2 as Role[],
  ...neutralRoles as Role[]
];

// 验证数据
console.log(`总共合并了 ${allRoles.length} 个角色`);
console.log(`鹅阵营: ${allRoles.filter(r => r.faction === 'goose').length} 个`);
console.log(`鸭阵营: ${allRoles.filter(r => r.faction === 'duck').length} 个`);
console.log(`中立阵营: ${allRoles.filter(r => r.faction === 'neutral').length} 个`);

// 检查重复ID
const duplicateIds = allRoles
  .map(r => r.id)
  .filter((id, index, array) => array.indexOf(id) !== index);

if (duplicateIds.length > 0) {
  console.warn(`发现重复的角色ID: ${duplicateIds.join(', ')}`);
}

// 保存合并后的数据
const outputPath = join(__dirname, '../data/all_roles.json');
writeFileSync(outputPath, JSON.stringify(allRoles, null, 2), 'utf8');
console.log(`数据已保存到: ${outputPath}`);

// 生成统计数据
const stats = {
  total: allRoles.length,
  byFaction: {
    goose: allRoles.filter(r => r.faction === 'goose').length,
    duck: allRoles.filter(r => r.faction === 'duck').length,
    neutral: allRoles.filter(r => r.faction === 'neutral').length
  },
  byDifficulty: {
    easy: allRoles.filter(r => r.difficulty === 'easy').length,
    medium: allRoles.filter(r => r.difficulty === 'medium').length,
    hard: allRoles.filter(r => r.difficulty === 'hard').length,
    very_hard: allRoles.filter(r => r.difficulty === 'very_hard').length
  },
  seasonal: allRoles.filter(r => r.isSeasonal).length,
  averagePopularity: Math.round(allRoles.reduce((sum, r) => sum + r.popularity, 0) / allRoles.length)
};

console.log('\n统计数据:');
console.log(JSON.stringify(stats, null, 2));

// 生成角色ID映射表
const idMap = allRoles.reduce((map, role) => {
  map[role.id] = {
    name: role.name,
    nameEn: role.nameEn,
    faction: role.faction
  };
  return map;
}, {} as Record<string, { name: string; nameEn: string; faction: string }>);

const idMapPath = join(__dirname, '../data/role_id_map.json');
writeFileSync(idMapPath, JSON.stringify(idMap, null, 2), 'utf8');
console.log(`角色ID映射表已保存到: ${idMapPath}`);