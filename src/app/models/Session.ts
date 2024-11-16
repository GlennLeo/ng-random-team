export class GameSession {
    id : string = '';
    createdAt : Date = new Date();
    status : string = '';
    winningTeam : number = 0;
    note : string = '';
    createdBy? : string;
    teamSummary : string = '';
}