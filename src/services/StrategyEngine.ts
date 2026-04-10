import { RoleStrategy, StrategyTip, StrategyLevel } from '../types';
import strategiesData from '../data/strategies.json';

export interface StrategyEngine {
  getStrategyForRole(roleId: string): RoleStrategy;
  getGooseDetectionTips(): StrategyTip[];
  getDuckDisguiseTips(): StrategyTip[];
  getStrategiesByLevel(level: StrategyLevel): StrategyTip[];
}

class StrategyEngineImpl implements StrategyEngine {
  private roleStrategies: RoleStrategy[] = strategiesData.roleStrategies as RoleStrategy[];
  private gooseTips: StrategyTip[] = strategiesData.gooseDetectionTips as StrategyTip[];
  private duckTips: StrategyTip[] = strategiesData.duckDisguiseTips as StrategyTip[];

  getStrategyForRole(roleId: string): RoleStrategy {
    const strategy = this.roleStrategies.find((s) => s.roleId === roleId);
    if (!strategy) {
      return { roleId, beginnerTips: [], advancedTips: [] };
    }
    return strategy;
  }

  getGooseDetectionTips(): StrategyTip[] {
    return this.gooseTips;
  }

  getDuckDisguiseTips(): StrategyTip[] {
    return this.duckTips;
  }

  getStrategiesByLevel(level: StrategyLevel): StrategyTip[] {
    const allTips: StrategyTip[] = [
      ...this.gooseTips,
      ...this.duckTips,
      ...this.roleStrategies.flatMap((s) => [...s.beginnerTips, ...s.advancedTips]),
    ];
    return allTips.filter((tip) => tip.level === level);
  }
}

export const strategyEngine: StrategyEngine = new StrategyEngineImpl();
