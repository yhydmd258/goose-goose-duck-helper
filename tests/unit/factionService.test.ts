import { describe, it, expect } from 'vitest';
import { factionService } from '../../src/services/FactionService';
import { FactionType } from '../../src/types';

describe('FactionService', () => {
  describe('getAllFactions', () => {
    it('应返回鹅、鸭、中立三个阵营', () => {
      const factions = factionService.getAllFactions();
      const types = factions.map((f) => f.type);

      expect(types).toContain('goose');
      expect(types).toContain('duck');
      expect(types).toContain('neutral');
      expect(factions).toHaveLength(3);
    });

    it('每个阵营应包含非空的胜利条件', () => {
      const factions = factionService.getAllFactions();

      for (const faction of factions) {
        expect(faction.winCondition).toBeTruthy();
        expect(faction.name).toBeTruthy();
      }
    });
  });

  describe('getFactionDetail', () => {
    const factionTypes: FactionType[] = ['goose', 'duck', 'neutral'];

    it.each(factionTypes)('阵营 %s 的详情字段应完整', (type) => {
      const detail = factionService.getFactionDetail(type);

      expect(detail.type).toBe(type);
      expect(detail.name).toBeTruthy();
      expect(detail.winCondition).toBeTruthy();
      expect(detail.playstyleGuide).toBeTruthy();
      expect(detail.warnings.length).toBeGreaterThan(0);
      expect(detail.beginnerTips.length).toBeGreaterThanOrEqual(3);
    });

    it('鹅阵营胜利条件应包含任务或投票相关内容', () => {
      const detail = factionService.getFactionDetail('goose');
      expect(detail.winCondition).toMatch(/任务|投票/);
    });

    it('鸭阵营胜利条件应包含击杀或破坏相关内容', () => {
      const detail = factionService.getFactionDetail('duck');
      expect(detail.winCondition).toMatch(/击杀|破坏/);
    });

    it('中立阵营胜利条件应提及独立目标', () => {
      const detail = factionService.getFactionDetail('neutral');
      expect(detail.winCondition).toMatch(/独立|特定|具体/);
    });

    it('查询无效阵营类型应抛出错误', () => {
      expect(() =>
        factionService.getFactionDetail('invalid' as FactionType)
      ).toThrow('Faction not found');
    });
  });
});
