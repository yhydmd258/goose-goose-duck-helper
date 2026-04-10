import { Faction, FactionDetail, FactionType } from '../types';
import factionsData from '../data/factions.json';

export interface FactionService {
  getAllFactions(): Faction[];
  getFactionDetail(factionType: FactionType): FactionDetail;
}

class FactionServiceImpl implements FactionService {
  private factions: FactionDetail[] = factionsData as FactionDetail[];

  getAllFactions(): Faction[] {
    return this.factions.map(({ type, name, winCondition }) => ({
      type,
      name,
      winCondition,
    }));
  }

  getFactionDetail(factionType: FactionType): FactionDetail {
    const detail = this.factions.find((f) => f.type === factionType);
    if (!detail) {
      throw new Error(`Faction not found: ${factionType}`);
    }
    return detail;
  }
}

export const factionService: FactionService = new FactionServiceImpl();
