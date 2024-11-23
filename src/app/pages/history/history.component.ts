import { Component, inject, OnInit } from '@angular/core';
import { BoardSession } from '../../models/Board';
import { BoardColumnComponent } from '../../shared/board-column/board-column.component';
import { SupabaseService } from '../../services/supabase.service';
import { mean, round } from 'lodash';
import { formatDate, getDuration } from '../../lib/utils';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [BoardColumnComponent, ChipModule, CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  boardSessions: BoardSession[] = [];
  private readonly supabase = inject(SupabaseService);
  constructor() {}

  async ngOnInit(): Promise<void> {
    const data = await this.supabase.getBoardList();
    this.boardSessions = data.map((item: any) => ({
      id: item.session_id,
      team: item.players.map((player: any) => ({
        id: player.player_id,
        name: player.name,
        hero: player.hero,
        elo: player.elo,
        team: +player.team,
      })),
      winningTeam: item.winning_team,
      created_at: formatDate(item.created_at),
      duration: getDuration(item.created_at, item.updated_at),
      dealer: item.dealer,
    }));
  }

  getMemberTeam1(boardSession: BoardSession) {
    return boardSession.team.filter((member) => +member.team === 1);
  }

  getMemberTeam2(boardSession: BoardSession) {
    return boardSession.team.filter((member) => +member.team === 2);
  }

  getTeam1Elo(boardSession: BoardSession) {
    return round(
      this.getMemberTeam1(boardSession).reduce(
        (acc, member) => acc + member.elo,
        0
      ),
      1
    );
  }

  getTeam2Elo(boardSession: BoardSession) {
    return round(
      this.getMemberTeam2(boardSession).reduce(
        (acc, member) => acc + member.elo,
        0
      ),
      1
    );
  }

  getWinningTeam(boardSession: BoardSession) {
    return boardSession.winningTeam;
  }
}
