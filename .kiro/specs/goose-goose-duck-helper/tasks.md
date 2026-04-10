# 实现计划：Goose Goose Duck 新手助手工具

## 概述

基于纯前端 TypeScript 架构，以静态 JSON 数据驱动，逐步实现角色查询、阵营说明、任务指南和策略建议四大核心功能。每个服务模块独立实现并配套测试，最后统一集成。

## 任务列表

- [x] 1. 搭建项目结构与核心类型定义
  - [x] 1.1 初始化 TypeScript 项目，配置 Vitest 和 fast-check 依赖
    - 创建 `package.json`、`tsconfig.json`
    - 安装 `vitest`、`fast-check` 依赖
    - 配置 `vitest.config.ts`
    - _需求: 全局_

  - [x] 1.2 定义核心数据类型和接口
    - 创建 `src/types.ts`，定义 `FactionType`、`DifficultyLevel`、`StrategyLevel`、`Role`、`Faction`、`FactionDetail`、`GameTask`、`RoleStrategy`、`StrategyTip` 等类型
    - 创建 `src/services/RoleService.ts`、`src/services/FactionService.ts`、`src/services/TaskService.ts`、`src/services/StrategyEngine.ts` 接口文件
    - _需求: 1.1, 2.1, 3.1, 4.1_

  - [x] 1.3 创建静态 JSON 数据文件
    - 创建 `src/data/roles.json`：包含角色名称、阵营、技能描述、使用建议
    - 创建 `src/data/factions.json`：包含阵营胜利条件、玩法指南、注意事项、新手建议（每阵营至少 3 条）
    - 创建 `src/data/tasks.json`：包含任务名称、难度等级、完成步骤、地图位置
    - 创建 `src/data/strategies.json`：包含角色策略、鹅阵营识别技巧、鸭阵营伪装策略，按新手/进阶分级
    - _需求: 1.1, 2.1, 2.3, 3.1, 3.3, 4.1, 4.2, 4.3, 4.4_

- [x] 2. 实现搜索工具模块
  - [x] 2.1 实现 SearchUtils 模块
    - 创建 `src/utils/searchUtils.ts`
    - 实现 `fuzzyMatch(query, target)` 模糊匹配函数，返回匹配得分
    - 实现 `findSimilar(query, candidates, topN)` 相似项查找函数
    - 处理空字符串和特殊字符输入
    - _需求: 1.2, 1.4, 3.2, 3.4_

  - [x] 2.2 编写 SearchUtils 单元测试
    - 测试空字符串搜索行为
    - 测试特殊字符输入处理
    - 测试模糊匹配准确性
    - _需求: 1.2, 1.4_

- [-] 3. 实现角色查询服务（RoleService）
  - [x] 3.1 实现 RoleService
    - 创建 `src/services/roleService.ts`
    - 实现 `getAllRoles()`：返回所有角色
    - 实现 `searchByName(query)`：根据名称模糊搜索角色
    - 实现 `filterByFaction(faction)`：按阵营筛选角色
    - 实现 `getSimilarRoles(query)`：推荐相似名称角色
    - _需求: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 3.2 编写 RoleService 属性测试
    - **Property 1: 角色数据完整性** — 验证所有角色包含非空名称、有效阵营和非空技能描述
    - **验证: 需求 1.1**

  - [ ]* 3.3 编写 RoleService 属性测试
    - **Property 2: 角色搜索返回匹配结果** — 验证使用角色名称搜索时结果包含该角色
    - **验证: 需求 1.2**

  - [ ]* 3.4 编写 RoleService 属性测试
    - **Property 3: 阵营筛选正确性与完整性** — 验证筛选结果中所有角色属于目标阵营且无遗漏
    - **验证: 需求 1.3**

  - [ ]* 3.5 编写 RoleService 属性测试
    - **Property 4: 不存在的角色名称搜索返回空结果并推荐相似角色** — 验证不存在的名称返回空结果且推荐列表非空
    - **验证: 需求 1.4**

  - [ ]* 3.6 编写 RoleService 单元测试
    - 测试具体角色搜索示例
    - 测试空字符串搜索返回所有角色
    - 测试不存在角色的提示信息
    - _需求: 1.2, 1.4_

- [ ] 4. 检查点 - 确保角色查询模块测试通过
  - 确保所有测试通过，如有问题请询问用户。

- [x] 5. 实现阵营说明服务（FactionService）
  - [x] 5.1 实现 FactionService
    - 创建 `src/services/factionService.ts`
    - 实现 `getAllFactions()`：返回所有阵营简要信息
    - 实现 `getFactionDetail(factionType)`：返回阵营详情（胜利条件、玩法指南、注意事项、新手建议）
    - _需求: 2.1, 2.2, 2.3_

  - [x] 5.2 编写 FactionService 属性测试
    - **Property 5: 阵营详情完整性** — 验证每个阵营详情包含非空玩法指南、非空注意事项列表，且新手建议至少 3 条
    - **验证: 需求 2.2, 2.3**

  - [x] 5.3 编写 FactionService 单元测试
    - 验证鹅、鸭、中立三个阵营的胜利条件数据存在
    - 验证阵营详情字段完整性
    - _需求: 2.1, 2.2, 2.3_

- [x] 6. 实现任务指南服务（TaskService）
  - [x] 6.1 实现 TaskService
    - 创建 `src/services/taskService.ts`
    - 实现 `getAllTasks()`：返回所有任务
    - 实现 `searchByName(query)`：根据任务名称搜索
    - 实现 `filterByDifficulty(difficulty)`：按难度筛选任务
    - _需求: 3.1, 3.2, 3.3, 3.4_

  - [x]* 6.2 编写 TaskService 属性测试
    - **Property 6: 任务数据完整性** — 验证所有任务包含非空名称、非空步骤列表、非空地图位置和有效难度等级
    - **验证: 需求 3.1, 3.3**

  - [ ]* 6.3 编写 TaskService 属性测试
    - **Property 7: 任务搜索返回匹配结果** — 验证使用任务名称搜索时结果包含该任务
    - **验证: 需求 3.2**

  - [ ]* 6.4 编写 TaskService 属性测试
    - **Property 8: 不存在的任务名称搜索返回空结果** — 验证不存在的名称返回空结果
    - **验证: 需求 3.4**

- [ ] 7. 检查点 - 确保阵营和任务模块测试通过
  - 确保所有测试通过，如有问题请询问用户。

- [x] 8. 实现策略建议引擎（StrategyEngine）
  - [x] 8.1 实现 StrategyEngine
    - 创建 `src/services/strategyEngine.ts`
    - 实现 `getStrategyForRole(roleId)`：返回指定角色的策略建议
    - 实现 `getGooseDetectionTips()`：返回鹅阵营识别鸭子技巧
    - 实现 `getDuckDisguiseTips()`：返回鸭阵营伪装和破坏策略
    - 实现 `getStrategiesByLevel(level)`：按新手/进阶层级筛选策略
    - _需求: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 8.2 编写 StrategyEngine 属性测试
    - **Property 9: 角色策略完整性与层级分类** — 验证每个角色的策略列表非空且层级为 beginner 或 advanced
    - **验证: 需求 4.1, 4.4**

  - [ ]* 8.3 编写 StrategyEngine 单元测试
    - 验证鹅阵营识别鸭子技巧数据非空
    - 验证鸭阵营伪装和破坏策略数据非空
    - 验证策略按层级正确分类
    - _需求: 4.2, 4.3, 4.4_

- [ ] 9. 集成与整体连接
  - [x] 9.1 创建统一的服务入口模块
    - 创建 `src/index.ts`，导出所有服务实例
    - 确保各服务模块正确加载 JSON 数据
    - 确保模块间无循环依赖
    - _需求: 1.1, 2.1, 3.1, 4.1_

  - [ ]* 9.2 编写集成测试
    - 测试跨服务的查询流程（如：查询角色 → 获取该角色策略）
    - 测试数据一致性（角色 ID 在策略数据中存在对应条目）
    - _需求: 1.2, 4.1_

- [ ] 10. 最终检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户。

## 备注

- 标记 `*` 的任务为可选任务，可跳过以加速 MVP 开发
- 每个任务均引用了对应的需求编号，确保可追溯性
- 检查点任务用于阶段性验证，确保增量开发的正确性
- 属性测试验证通用正确性属性，单元测试验证具体示例和边界情况
