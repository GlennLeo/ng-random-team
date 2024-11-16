export class Player {
  id: number = 0;
  name: string = '';
  score : number = 0;
}

export class Attendee extends Player {
  checked: boolean = false;
}

export class TeamMember {
  id: number = 0;
  hero: string = '';
  name: string = '';
  score: number = 0;
  team: number = 0;
  civId? : number;
}

export interface PlayerSession {
  id: number;
  session_id: number;
  team: string;
  hero: string;
  player_id: Player;
}
