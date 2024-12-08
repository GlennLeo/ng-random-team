import { Component, inject, OnInit } from '@angular/core';
import { BoardSession } from '../../models/Board';
import { BoardColumnComponent } from '../../shared/board-column/board-column.component';
import { SupabaseService } from '../../services/supabase.service';
import { round } from 'lodash';
import { formatDate, getDuration } from '../../lib/utils';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

const LIMIT = 12;

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [BoardColumnComponent, ChipModule, CommonModule, PaginatorModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);

  boardSessions: BoardSession[] = [];
  offset = 0;
  limit = LIMIT;
  total = 0;
  player_name_search: { name: string } | undefined;
  players = [] as { name: string }[];
  constructor() {}

  async ngOnInit(): Promise<void> {
    const data = await this.supabase.searchBoardList({
      limit: LIMIT,
      offset: 0,
    });
    const playersData = await this.supabase.getPlayers();
    this.players =
      playersData.data?.map((player: any) => ({ name: player.name })) ?? [];
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
    this.total = data[0]?.total_records;
  }

  async searchBoardListByPlayer() {
    const data = await this.supabase.searchBoardList({
      playerName: this.player_name_search?.name,
      offset: 0,
      limit: LIMIT,
    });
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
    this.total = data[0]?.total_records;
  }

  getMemberTeam1(boardSession: BoardSession) {
    return boardSession.team.filter(
      (member) => +member.team === 1 && member.name !== 'Phantom'
    );
  }

  getMemberTeam2(boardSession: BoardSession) {
    return boardSession.team.filter(
      (member) => +member.team === 2 && member.name !== 'Phantom'
    );
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
  async onPageChange(event: any) {
    const data = await this.supabase.searchBoardList({
      playerName: this.player_name_search?.name,
      offset: event.first,
      limit: event.rows,
    });
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

  async searchHistoryByPlayer(event: any) {
    if (!event.value) return;
    this.player_name_search = {
      name: event.value.name,
    };
    this.offset = 0;
    this.limit = LIMIT;
    const data = await this.supabase.searchBoardList({
      playerName: this.player_name_search.name,
      offset: this.offset,
      limit: this.limit,
    });
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

    this.total = data[0]?.total_records;
  }
}
