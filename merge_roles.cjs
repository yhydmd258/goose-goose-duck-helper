const fs = require('fs');
const path = require('path');

// 读取所有JSON文件
const dataDir = path.join(__dirname, 'src', 'data');

// 修复不完整的JSON文件
function fixIncompleteJson(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否以数组结尾
  if (!content.trim().endsWith(']')) {
    // 找到最后一个完整的对象
    const lastComplete = content.lastIndexOf('}');
    if (lastComplete !== -1) {
      content = content.substring(0, lastComplete + 1) + ']';
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`修复了文件: ${path.basename(filePath)}`);
    }
  }
}

// 修复所有文件
const jsonFiles = [
  'complete_roles.json',
  'goose_roles_part2.json', 
  'duck_roles.json',
  'duck_roles_part2.json',
  'neutral_roles.json'
];

jsonFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    fixIncompleteJson(filePath);
  }
});

// 现在读取并合并所有数据
let allRoles = [];

jsonFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const roles = JSON.parse(content);
    allRoles = allRoles.concat(roles);
    console.log(`从 ${file} 读取了 ${roles.length} 个角色`);
  } catch (error) {
    console.error(`读取 ${file} 时出错:`, error.message);
  }
});

console.log(`\n总共合并了 ${allRoles.length} 个角色`);

// 按阵营统计
const gooseCount = allRoles.filter(r => r.faction === 'goose').length;
const duckCount = allRoles.filter(r => r.faction === 'duck').length;
const neutralCount = allRoles.filter(r => r.faction === 'neutral').length;

console.log(`鹅阵营: ${gooseCount} 个`);
console.log(`鸭阵营: ${duckCount} 个`);
console.log(`中立阵营: ${neutralCount} 个`);

// 检查重复ID
const idMap = {};
const duplicateIds = [];

allRoles.forEach(role => {
  if (idMap[role.id]) {
    duplicateIds.push(role.id);
  } else {
    idMap[role.id] = true;
  }
});

if (duplicateIds.length > 0) {
  console.warn(`发现重复的角色ID: ${duplicateIds.join(', ')}`);
}

// 保存合并后的数据
const outputPath = path.join(dataDir, 'all_roles.json');
fs.writeFileSync(outputPath, JSON.stringify(allRoles, null, 2), 'utf8');
console.log(`\n合并后的数据已保存到: ${outputPath}`);

// 生成统计数据
const stats = {
  total: allRoles.length,
  byFaction: {
    goose: gooseCount,
    duck: duckCount,
    neutral: neutralCount
  },
  byDifficulty: {
    easy: allRoles.filter(r => r.difficulty === 'easy').length,
    medium: allRoles.filter(r => r.difficulty === 'medium').length,
    hard: allRoles.filter(r => r.difficulty === 'hard').length,
    very_hard: allRoles.filter(r => r.difficulty === 'very_hard').length
  },
  seasonal: allRoles.filter(r => r.isSeasonal).length,
  averagePopularity: Math.round(allRoles.reduce((sum, r) => sum + (r.popularity || 50), 0) / allRoles.length)
};

console.log('\n统计数据:');
console.log(JSON.stringify(stats, null, 2));

// 生成角色ID映射表
const idMapping = allRoles.reduce((map, role) => {
  map[role.id] = {
    name: role.name,
    nameEn: role.nameEn,
    faction: role.faction,
    difficulty: role.difficulty
  };
  return map;
}, {});

const idMapPath = path.join(dataDir, 'role_id_map.json');
fs.writeFileSync(idMapPath, JSON.stringify(idMapping, null, 2), 'utf8');
console.log(`\n角色ID映射表已保存到: ${idMapPath}`);