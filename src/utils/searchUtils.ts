/**
 * SearchUtils - 模糊搜索工具模块
 * 提供模糊匹配和相似项查找功能，支持中文、拼音、拼音首字母搜索。
 */

import { pinyin } from 'pinyin-pro';

/**
 * 转义正则表达式中的特殊字符
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** 缓存拼音转换结果 */
const pinyinCache = new Map<string, { fulls: string[]; initials: string[] }>();

/**
 * 获取中文字符串的所有可能拼音组合（处理多音字），带缓存。
 * 返回所有全拼组合和首字母组合。
 */
function getPinyin(text: string): { fulls: string[]; initials: string[] } {
  const cached = pinyinCache.get(text);
  if (cached) return cached;

  // 获取每个字的所有可能拼音
  const charPinyins: string[][] = [];
  const charInitials: string[][] = [];
  for (const char of text) {
    if (/[\u4e00-\u9fff]/.test(char)) {
      const allPy = pinyin(char, { toneType: 'none', type: 'array', multiple: true });
      // pinyin-pro multiple 模式对单字返回所有读音用空格分隔
      const pyStr = pinyin(char, { toneType: 'none', multiple: true });
      const readings = [...new Set(pyStr.split(' ').map(s => s.toLowerCase()))];
      charPinyins.push(readings);
      charInitials.push([...new Set(readings.map(r => r[0]))]);
    } else {
      charPinyins.push([char.toLowerCase()]);
      charInitials.push([char.toLowerCase()]);
    }
  }

  // 生成所有组合（限制最多32种避免爆炸）
  function combine(arrays: string[][]): string[] {
    let results = [''];
    for (const arr of arrays) {
      const next: string[] = [];
      for (const prefix of results) {
        for (const item of arr) {
          next.push(prefix + item);
          if (next.length > 32) return next;
        }
      }
      results = next;
    }
    return results;
  }

  const fulls = combine(charPinyins);
  const initials = combine(charInitials);
  const result = { fulls, initials };
  pinyinCache.set(text, result);
  return result;
}

/**
 * 检测字符串是否包含中文字符
 */
function hasChinese(str: string): boolean {
  return /[\u4e00-\u9fff]/.test(str);
}

/**
 * 模糊匹配：计算 query 与 target 之间的匹配得分。
 * 得分范围 0~1，1 表示完全匹配，0 表示不匹配。
 *
 * 匹配策略（按优先级）：
 * 1. 原文完全相等 → 1.0
 * 2. 原文包含匹配 → 0.5 + 长度比例加分
 * 3. 拼音全拼完全匹配 → 0.95
 * 4. 拼音全拼包含匹配 → 0.45 + 长度比例加分
 * 5. 拼音首字母完全匹配 → 0.85
 * 6. 拼音首字母包含匹配 → 0.4 + 长度比例加分
 * 7. 子序列匹配（原文或拼音） → 基于比例
 * 8. 无匹配 → 0
 */
export function fuzzyMatch(query: string, target: string): number {
  if (query === '' || target === '') return 0;

  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // 1. 原文完全匹配
  if (q === t) return 1.0;

  // 2. 原文包含匹配
  const escaped = escapeRegex(q);
  if (new RegExp(escaped).test(t)) {
    return 0.5 + 0.4 * (q.length / t.length);
  }

  // 拼音匹配（当 target 含中文时）
  if (hasChinese(target)) {
    const targetPy = getPinyin(target);

    // 如果 query 是纯拉丁字符，尝试拼音匹配
    if (/^[a-zA-Z]+$/.test(query)) {
      // 3. 拼音全拼完全匹配
      if (targetPy.fulls.includes(q)) return 0.95;

      // 4. 拼音全拼包含匹配
      for (const full of targetPy.fulls) {
        if (full.includes(q)) {
          return 0.45 + 0.4 * (q.length / full.length);
        }
      }

      // 5. 拼音首字母完全匹配
      if (targetPy.initials.includes(q)) return 0.85;

      // 6. 拼音首字母包含匹配
      for (const ini of targetPy.initials) {
        if (ini.includes(q)) {
          return 0.4 + 0.3 * (q.length / ini.length);
        }
      }

      // 7a. 拼音全拼子序列匹配
      for (const pf of targetPy.fulls) {
        let qi2 = 0;
        for (let ti = 0; ti < pf.length && qi2 < q.length; ti++) {
          if (q[qi2] === pf[ti]) qi2++;
        }
        if (qi2 === q.length) {
          return 0.25 * (q.length / pf.length);
        }
      }
    }

    // 如果 query 含中文，也对拼音做匹配
    if (hasChinese(query)) {
      const queryPy = getPinyin(query);
      for (const qFull of queryPy.fulls) {
        for (const tFull of targetPy.fulls) {
          if (tFull.includes(qFull)) {
            return 0.45 + 0.4 * (qFull.length / tFull.length);
          }
        }
      }
    }
  }

  // 7b. 原文子序列匹配
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (q[qi] === t[ti]) qi++;
  }
  if (qi === q.length) {
    return 0.3 * (q.length / t.length);
  }

  return 0;
}

/**
 * 查找与 query 最相似的候选项，按匹配得分降序返回前 topN 个结果。
 * 仅返回得分 > 0 的候选项。
 */
export function findSimilar(
  query: string,
  candidates: string[],
  topN: number = 5
): string[] {
  if (query === '' || candidates.length === 0) return [];

  return candidates
    .map((c) => ({ candidate: c, score: fuzzyMatch(query, c) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((item) => item.candidate);
}
