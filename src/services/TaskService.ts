import { GameTask, DifficultyLevel } from '../types';
import { fuzzyMatch } from '../utils/searchUtils';
import tasksData from '../data/tasks.json';

export interface TaskService {
  searchByName(query: string): GameTask[];
  filterByDifficulty(difficulty: DifficultyLevel): GameTask[];
  getAllTasks(): GameTask[];
}

class TaskServiceImpl implements TaskService {
  private tasks: GameTask[] = tasksData as GameTask[];

  getAllTasks(): GameTask[] {
    return this.tasks;
  }

  searchByName(query: string): GameTask[] {
    if (query === '') return this.tasks;
    return this.tasks.filter((task) => fuzzyMatch(query, task.name) > 0);
  }

  filterByDifficulty(difficulty: DifficultyLevel): GameTask[] {
    return this.tasks.filter((task) => task.difficulty === difficulty);
  }
}

export const taskService: TaskService = new TaskServiceImpl();
