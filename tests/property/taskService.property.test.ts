import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { taskService } from '../../src/services/TaskService';
import { DifficultyLevel } from '../../src/types';

const allTasks = taskService.getAllTasks();
const allDifficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];

describe('TaskService Property Tests', () => {
  /**
   * Feature: goose-goose-duck-helper, Property 6: 任务数据完整性
   *
   * 对于任务数据库中的任意任务，该任务必须包含非空的名称（name）、非空的完成步骤列表（steps）、
   * 非空的地图位置（mapLocation），且难度等级（difficulty）为 'easy'、'medium' 或 'hard' 之一。
   *
   * Validates: Requirements 3.1, 3.3
   */
  it('Property 6: 所有任务包含非空名称、非空步骤列表、非空地图位置和有效难度等级', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allTasks),
        (task) => {
          expect(task.name).toBeTruthy();
          expect(task.name.length).toBeGreaterThan(0);

          expect(Array.isArray(task.steps)).toBe(true);
          expect(task.steps.length).toBeGreaterThan(0);
          task.steps.forEach((step) => {
            expect(step.length).toBeGreaterThan(0);
          });

          expect(task.mapLocation).toBeTruthy();
          expect(task.mapLocation.length).toBeGreaterThan(0);

          expect(allDifficulties).toContain(task.difficulty);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: goose-goose-duck-helper, Property 7: 任务搜索返回匹配结果
   *
   * 对于任务数据库中的任意任务，使用该任务的名称进行搜索时，搜索结果应包含该任务，
   * 且返回的任务对象应包含完成步骤（steps）和地图位置（mapLocation）字段。
   *
   * Validates: Requirements 3.2
   */
  it('Property 7: 使用任务名称搜索时结果包含该任务', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allTasks),
        (task) => {
          const results = taskService.searchByName(task.name);
          const found = results.find((r) => r.id === task.id);

          expect(found).toBeDefined();
          expect(found!.steps).toBeDefined();
          expect(Array.isArray(found!.steps)).toBe(true);
          expect(found!.steps.length).toBeGreaterThan(0);
          expect(found!.mapLocation).toBeDefined();
          expect(found!.mapLocation.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: goose-goose-duck-helper, Property 8: 不存在的任务名称搜索返回空结果
   *
   * 对于任意不存在于任务数据库中的搜索字符串，任务搜索应返回空结果。
   *
   * Validates: Requirements 3.4
   */
  it('Property 8: 不存在的任务名称搜索返回空结果', () => {
    const existingNames = allTasks.map((t) => t.name.toLowerCase());

    fc.assert(
      fc.property(
        fc.string({ minLength: 8, maxLength: 20 }).filter((s) => /^[xzqw789]+$/.test(s)),
        (randomQuery) => {
          // Skip if the random string happens to fuzzy-match an existing task
          if (existingNames.some((name) => name.includes(randomQuery.toLowerCase()))) return;

          const results = taskService.searchByName(randomQuery);
          expect(results).toEqual([]);
        }
      ),
      { numRuns: 100 }
    );
  });
});
