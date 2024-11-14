export class Player {
  id: number = 0;
  name: string = '';
  scores: number[] = [];
}

export class Attendee extends Player {
  checked: boolean = false;
  score: number = 0;
}

export class TeamMember {
  id: number = 0;
  hero: string = '';
  name: string = '';
  score: number = 0;
  team: number = 0;
}

export interface PlayerSession {
  id: number;
  session_id: number;
  team: string;
  hero: string;
  player_id: Player;
}
