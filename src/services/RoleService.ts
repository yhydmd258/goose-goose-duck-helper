import { Role, FactionType } from '../types';
import { fuzzyMatch, findSimilar } from '../utils/searchUtils';
import rolesData from '../data/all_roles.json';
import { ROLE_TAGS, SLANG_ROLE_MAP } from '../data/roleTags';

export interface SlangMatch {
  role: Role;
  matchedSlang: string[];
  matchedDialogues: string[];
  matchedStrategies: string[];
}

export interface RoleService {
  searchByName(query: string): Role[];
  filterByFaction(faction: FactionType): Role[];
  getAllRoles(): Role[];
  getSimilarRoles(query: string): Role[];
  searchBySlang(query: string): SlangMatch[];
  filterByTag(tag: string): Role[];
}

class RoleServiceImpl implements RoleService {
  private roles: Role[];

  constructor() {
    // Inject tags from roleTags mapping
    this.roles = (rolesData as Role[]).map(r => ({
      ...r,
      tags: ROLE_TAGS[r.id] || [],
    }));
  }

  getAllRoles(): Role[] {
    return this.roles;
  }

  searchByName(query: string): Role[] {
    if (query === '') return this.roles;

    return this.roles.filter(
      (role) => fuzzyMatch(query, role.name) > 0 || fuzzyMatch(query, role.nameEn) > 0
    );
  }

  filterByFaction(faction: FactionType): Role[] {
    return this.roles.filter((role) => role.faction === faction);
  }

  getSimilarRoles(query: string): Role[] {
    const candidates = this.roles.flatMap((role) => [role.name, role.nameEn]);
    const similarNames = findSimilar(query, candidates);

    return this.roles.filter(
      (role) => similarNames.includes(role.name) || similarNames.includes(role.nameEn)
    );
  }

  searchBySlang(query: string): SlangMatch[] {
    if (query === '') return [];
    const q = query.toLowerCase();
    const results: SlangMatch[] = [];
    const matchedIds = new Set<string>();

    // 1. Check SLANG_ROLE_MAP for direct keyword matches
    for (const [keyword, roleIds] of Object.entries(SLANG_ROLE_MAP)) {
      if (keyword.includes(q) || q.includes(keyword)) {
        for (const id of roleIds) {
          if (!matchedIds.has(id)) {
            const role = this.roles.find(r => r.id === id);
            if (role) {
              matchedIds.add(id);
              results.push({ role, matchedSlang: [`分类关键词：${keyword}`], matchedDialogues: [], matchedStrategies: [] });
            }
          }
        }
      }
    }

    // 2. Search in role slang, dialogues, strategies
    for (const role of this.roles) {
      if (matchedIds.has(role.id)) {
        // Already matched via SLANG_ROLE_MAP, merge additional matches
        const existing = results.find(r => r.role.id === role.id)!;
        const extraSlang = (role.slang || []).filter(s => s.toLowerCase().includes(q) || fuzzyMatch(query, s) > 0.3);
        const extraDialogues = (role.dialogues || []).filter(d => d.toLowerCase().includes(q));
        const extraStrategies = (role.commonStrategies || []).filter(s => s.toLowerCase().includes(q));
        existing.matchedSlang.push(...extraSlang);
        existing.matchedDialogues.push(...extraDialogues);
        existing.matchedStrategies.push(...extraStrategies);
        continue;
      }

      const matchedSlang = (role.slang || []).filter(s => s.toLowerCase().includes(q) || fuzzyMatch(query, s) > 0.3);
      const matchedDialogues = (role.dialogues || []).filter(d => d.toLowerCase().includes(q));
      const matchedStrategies = (role.commonStrategies || []).filter(s => s.toLowerCase().includes(q));

      if (matchedSlang.length > 0 || matchedDialogues.length > 0 || matchedStrategies.length > 0) {
        results.push({ role, matchedSlang, matchedDialogues, matchedStrategies });
      }
    }

    results.sort((a, b) =>
      (b.matchedSlang.length * 3 + b.matchedDialogues.length + b.matchedStrategies.length) -
      (a.matchedSlang.length * 3 + a.matchedDialogues.length + a.matchedStrategies.length)
    );

    return results;
  }

  filterByTag(tag: string): Role[] {
    return this.roles.filter(r => (r.tags || []).includes(tag));
  }
}

export const roleService: RoleService = new RoleServiceImpl();
