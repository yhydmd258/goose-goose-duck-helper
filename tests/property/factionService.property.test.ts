import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { factionService } from '../../src/services/FactionService';
import { FactionType } from '../../src/types';

const allFactionTypes: FactionType[] = ['goose', 'duck', 'neutral'];

describe('FactionService Property Tests', () => {
  /**
   * Feature: goose-goose-duck-helper, Property 5: 阵营详情完整性
   *
   * 对于任意阵营类型，获取阵营详情时应返回包含非空的玩法指南（playstyleGuide）、
   * 非空的注意事项列表（warnings），且新手建议列表（beginnerTips）长度至少为 3。
   *
   * Validates: Requirements 2.2, 2.3
   */
  it('Property 5: 每个阵营详情包含非空玩法指南、非空注意事项列表，且新手建议至少 3 条', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allFactionTypes),
        (factionType) => {
          const detail = factionService.getFactionDetail(factionType);

          // 非空玩法指南
          expect(detail.playstyleGuide).toBeTruthy();
          expect(detail.playstyleGuide.length).toBeGreaterThan(0);

          // 非空注意事项列表
          expect(detail.warnings).toBeDefined();
          expect(Array.isArray(detail.warnings)).toBe(true);
          expect(detail.warnings.length).toBeGreaterThan(0);
          detail.warnings.forEach((w) => {
            expect(w.length).toBeGreaterThan(0);
          });

          // 新手建议至少 3 条
          expect(detail.beginnerTips).toBeDefined();
          expect(Array.isArray(detail.beginnerTips)).toBe(true);
          expect(detail.beginnerTips.length).toBeGreaterThanOrEqual(3);
          detail.beginnerTips.forEach((tip) => {
            expect(tip.length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
