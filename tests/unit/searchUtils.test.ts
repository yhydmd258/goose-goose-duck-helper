import { describe, it, expect } from 'vitest';
import { fuzzyMatch, findSimilar } from '../../src/utils/searchUtils';

describe('SearchUtils', () => {
  describe('fuzzyMatch', () => {
    // 空字符串搜索行为
    it('should return 0 when query is empty', () => {
      expect(fuzzyMatch('', 'target')).toBe(0);
    });

    it('should return 0 when target is empty', () => {
      expect(fuzzyMatch('query', '')).toBe(0);
    });

    it('should return 0 when both are empty', () => {
      expect(fuzzyMatch('', '')).toBe(0);
    });

    // 模糊匹配准确性
    it('should return 1.0 for exact match', () => {
      expect(fuzzyMatch('警长', '警长')).toBe(1.0);
    });

    it('should return 1.0 for exact match case-insensitive', () => {
      expect(fuzzyMatch('Sheriff', 'sheriff')).toBe(1.0);
    });

    it('should return score > 0.5 for substring match', () => {
      const score = fuzzyMatch('警长', '副警长');
      expect(score).toBeGreaterThan(0.5);
      expect(score).toBeLessThan(1.0);
    });

    it('should return score > 0 for subsequence match', () => {
      const score = fuzzyMatch('abc', 'aXbXc');
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(0.5);
    });

    it('should return 0 for completely unrelated strings', () => {
      expect(fuzzyMatch('xyz', '鹅鸭杀')).toBe(0);
    });

    // 特殊字符输入处理
    it('should handle regex special characters in query without throwing', () => {
      expect(() => fuzzyMatch('test.*+?^${}()|[]\\', 'target')).not.toThrow();
    });

    it('should return a valid score when query contains special characters', () => {
      const score = fuzzyMatch('a.b', 'a.b');
      expect(score).toBe(1.0);
    });
  });

  describe('findSimilar', () => {
    const candidates = ['警长', '副警长', '工程师', '模仿者', '鸽子'];

    // 空字符串搜索行为
    it('should return empty array when query is empty', () => {
      expect(findSimilar('', candidates)).toEqual([]);
    });

    it('should return empty array when candidates is empty', () => {
      expect(findSimilar('警长', [])).toEqual([]);
    });

    // 模糊匹配准确性
    it('should return exact match first', () => {
      const results = findSimilar('警长', candidates);
      expect(results[0]).toBe('警长');
    });

    it('should include similar candidates', () => {
      const results = findSimilar('警长', candidates);
      expect(results).toContain('副警长');
    });

    it('should respect topN limit', () => {
      const results = findSimilar('a', ['ab', 'ac', 'ad', 'ae', 'af'], 2);
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should not return candidates with zero score', () => {
      const results = findSimilar('xyz', ['abc', 'def']);
      expect(results).toEqual([]);
    });

    // 特殊字符输入处理
    it('should handle special characters in query without throwing', () => {
      expect(() => findSimilar('test[.*]', candidates)).not.toThrow();
    });
  });
});
