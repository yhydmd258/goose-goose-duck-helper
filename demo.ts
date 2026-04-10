import { roleService } from './src/services/RoleService';
import { factionService } from './src/services/FactionService';
import { taskService } from './src/services/TaskService';
import { strategyEngine } from './src/services/StrategyEngine';

// 1. 角色查询
console.log('=== 角色查询 ===');
console.log('搜索"警长":', roleService.searchByName('警长').map(r => `${r.name}(${r.faction})`));
console.log('鸭阵营角色:', roleService.filterByFaction('duck').map(r => r.name));
console.log('相似角色推荐:', roleService.getSimilarRoles('警'));

// 2. 阵营说明
console.log('\n=== 阵营说明 ===');
const gooseDetail = factionService.getFactionDetail('goose');
console.log(`${gooseDetail.name} 胜利条件: ${gooseDetail.winCondition}`);
console.log(`新手建议(${gooseDetail.beginnerTips.length}条):`, gooseDetail.beginnerTips[0]);

// 3. 任务指南
console.log('\n=== 任务指南 ===');
console.log('所有任务:', taskService.getAllTasks().map(t => `${t.name}(${t.difficulty})`));
console.log('搜索"接线":', taskService.searchByName('接线').map(t => `${t.name} @ ${t.mapLocation}`));
console.log('困难任务:', taskService.filterByDifficulty('hard').map(t => t.name));

// 4. 策略建议
console.log('\n=== 策略建议 ===');
const sheriffStrategy = strategyEngine.getStrategyForRole('sheriff');
console.log('警长新手策略:', sheriffStrategy.beginnerTips.map(t => t.title));
console.log('鹅阵营识别技巧:', strategyEngine.getGooseDetectionTips().map(t => t.title));
console.log('鸭阵营伪装策略:', strategyEngine.getDuckDisguiseTips().map(t => t.title));
console.log('新手级策略数量:', strategyEngine.getStrategiesByLevel('beginner').length);
