export class Player {
  id: number = 0;
  name: string = '';
  elo: number = 0;
}

export class Attendee extends Player {
  checked: boolean = false;
}

export class TeamMember {
  id: number = 0;
  hero: string = '';
  name: string = '';
  elo: number = 0;
  team: number = 0;
  total_wins?: number = 0;
  total_losts?: number = 0;
  win_rate?: number = 0;
}

export interface PlayerSession {
  id: number;
  session_id: number;
  team: string;
  hero: string;
  player_id: Player;
}
