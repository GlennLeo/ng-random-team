import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameSession } from '../../models/Session';
import { FormatDatePipe } from '../../pipes/formatdate.pipes';
import { ContextService } from '../../services/context.service';
import { ClientDataService } from '../../services/data.service';
import { BoardColumnComponent } from '../../shared/board-column/board-column.component';
import { UpdateGameSessionDialogComponent } from './update-session-dialog.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [BoardColumnComponent, FormatDatePipe],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  isAdmin: boolean = false;
  data: GameSession[] = [];
  constructor(private dataService: ClientDataService, private contextService: ContextService, private dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    const profile = await this.contextService.currentProfile();
    this.isAdmin = profile && profile.isAdmin;
  }
  

  async loadData() : Promise<void> {
    this.data = await this.dataService.getSessionList(1, 100);
  }

  openEditDialog(session: GameSession): void {
    const dialogRef = this.dialog.open(UpdateGameSessionDialogComponent, {
      width: '600px',
      data: session
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return;
      await this.updateGameSession(result!);
      await this.loadData();
      alert('Đã cập nhật');
    });
  }

  async updateGameSession(updatedSession: GameSession): Promise<void> {
    await this.dataService.updateSession(updatedSession.id, updatedSession);
  }

  getSummary(session: GameSession) {
    if (!session.teamSummary) return '';
    let html = '';
    const template = '<span class="{textClass}">{player}' +
      '<span class="bg-sky-500 text-white text-sm font-semibold rounded ms-2 mx-2">{civilization}</span></span>';
    const summaryObj = JSON.parse(session.teamSummary);
    for (let team of summaryObj) {
      let textClass = session.status == '0' ? 'text-white' : session.winningTeam == team.team ? 'text-green-500' : 'text-red-500';
      let teamHtml = `<span class="${textClass}">Team ${team.team}: </span>`
      for (let player of team.players) {
        const playerHtml = template.replace('{player}', player.player).replace('{civilization}', player.civilization).replace('{textClass}', textClass);
        teamHtml += playerHtml;
      }
      if (team.team == 1) teamHtml += '<br />';
      html += teamHtml;
    }
    return html;
  }
}
