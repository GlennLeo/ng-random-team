import { TeamMember } from './Player';

export class BoardSession {
  id: number = 0;
  team: TeamMember[] = [];
  winningTeam: number = 0;
}
