import { describe, it, expect } from 'vitest';
import { roleService } from '../../src/services/RoleService';

describe('RoleService', () => {
  describe('getAllRoles', () => {
    it('should return all roles', () => {
      const roles = roleService.getAllRoles();
      expect(roles.length).toBeGreaterThan(0);
      expect(roles.every((r) => r.id && r.name && r.faction)).toBe(true);
    });
  });

  describe('searchByName', () => {
    it('should return all roles when query is empty string', () => {
      const all = roleService.getAllRoles();
      const result = roleService.searchByName('');
      expect(result).toEqual(all);
    });

    it('should find a role by Chinese name', () => {
      const result = roleService.searchByName('警长');
      expect(result.some((r) => r.id === 'sheriff')).toBe(true);
    });

    it('should find a role by English name', () => {
      const result = roleService.searchByName('Sheriff');
      expect(result.some((r) => r.id === 'sheriff')).toBe(true);
    });

    it('should return empty array for non-existent role', () => {
      const result = roleService.searchByName('不存在的角色xyz');
      expect(result).toEqual([]);
    });

    it('should handle special characters in query', () => {
      const result = roleService.searchByName('警长.*');
      // Should not throw, may or may not match depending on escaping
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('filterByFaction', () => {
    it('should return only goose faction roles', () => {
      const result = roleService.filterByFaction('goose');
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((r) => r.faction === 'goose')).toBe(true);
    });

    it('should return only duck faction roles', () => {
      const result = roleService.filterByFaction('duck');
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((r) => r.faction === 'duck')).toBe(true);
    });

    it('should return only neutral faction roles', () => {
      const result = roleService.filterByFaction('neutral');
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((r) => r.faction === 'neutral')).toBe(true);
    });
  });

  describe('getSimilarRoles', () => {
    it('should return similar roles for a partial name', () => {
      const result = roleService.getSimilarRoles('警');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array for empty query', () => {
      const result = roleService.getSimilarRoles('');
      expect(result).toEqual([]);
    });
  });
});
