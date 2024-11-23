import { TeamMember } from './Player';

export class BoardSession {
  id: number = 0;
  team: TeamMember[] = [];
  winningTeam: number = 0;
  created_at?: string;
  duration?: string;
  dealer?: string;
}
