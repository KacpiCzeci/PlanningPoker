/**
 * Generated by orval v6.7.1 🍺
 * Do not edit manually.
 * Planning Poker API
 * OpenAPI spec version: 1.0
 */
import type { PlayerDto } from './playerDto';

export interface IssueDto {
  finished: boolean;
  gameName: string;
  players: PlayerDto[];
  tasks: string[];
  current: boolean;
  storyPoints: number | null;
  id: string;
}
